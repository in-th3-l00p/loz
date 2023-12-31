<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\Map;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Netopia\Payment\Address;
use Netopia\Payment\Invoice;
use Netopia\Payment\Request\Card;
use Netopia\Payment\Request\PaymentAbstract;

class PaymentController extends Controller
{
    public $paymentUrl = "http://sandboxsecure.mobilpay.ro";
    public $publicX509FilePath = "/home/intheloop/Desktop/loz/sandbox.2XI1-LBXB-L1ER-Q74C-VUYR.public.cer";
    public $privateX509FilePath = "/home/intheloop/Desktop/loz/sandbox.2XI1-LBXB-L1ER-Q74C-VUYRprivate.key";

    public function submit(Request $request) {
        $request->validate([
            "cart" => "required|array",
            "type" => "required|in:person,company",
            "firstName" => "required",
            "lastName" => "required",
            "address" => "required",
            "email" => "required|email",
            "mobilePhone" => "required"
        ]);

        $initial_items = $request->cart;
        $items = [];
        $unavailable = [];
        foreach ($initial_items as $item) {
            $map = Map::findOrFail($item["mapId"]);
            $location = Location::findOrFail($item["locationId"]);
            if (!$location->available || $location->order_id !== null)
                array_push($unavailable, $location->id);
            array_push($items, [
                "map" => $map,
                "location" => $location
            ]); 
        }

        if (sizeof($unavailable) > 0)
            return response([ "unavailable" => $unavailable ], 400);

        $cost = 0;
        foreach ($items as $item) {
            $cost += $item["location"]->price;
            $item["location"]->update([
                "available" => false,
                "user_id" => auth()->user()->id,
                "claimed_at" => now()
            ]);
        }
        $order = Order::create([
            // "locations" => $items,
            "status" => "not_started",
            "amount" => $cost,
            "currency" => "RON",
            "description" => "Achizitionare lozuri",
            "billing_address" => json_encode([
                "firstName" => $request->firstName,
                "lastName" => $request->lastName,
                "address" => $request->address,
                "email" => $request->email,
                "mobilePhone" => $request->mobilePhone
            ])
        ]);
        // foreach ($items as $item)
        //     $item["location"]->update(["order_id" => $order->id]);

        $paymentRequest = new Card();
        $paymentRequest->signature = "2XI1-LBXB-L1ER-Q74C-VUYR";
        $paymentRequest->orderId = $order->id;
        $paymentRequest->confirmUrl = "http://localhost:3000";
        $paymentRequest->returnUrl = "http://localhost:8000/payment/ipn";

        $paymentRequest->invoice = new Invoice();
        $paymentRequest->invoice->currency = $order->currency;
        $paymentRequest->invoice->amount = $order->amount;
        $paymentRequest->invoice->tokenId = null;
        $paymentRequest->invoice->details = $order->description;

        $billingAddress = new Address();
        $billingAddress->type = $request->type;
        $billingAddress->firstName = $request->firstName;
        $billingAddress->lastName = $request->lastName;
        $billingAddress->address = $request->address;
        $billingAddress->email = $request->email;
        $billingAddress->mobilePhone = $request->mobilePhone;
        $paymentRequest->invoice->setBillingAddress($billingAddress);

        $paymentRequest->encrypt($this->publicX509FilePath);
        $env_key = $paymentRequest->getEnvKey();
        $data = $paymentRequest->getEncData();
        $cipher = $paymentRequest->getCipher();
        $iv = $paymentRequest->getIv();
        $order->update([ 
            "status" => "pending",
            "env_key" => $env_key,
            "data" => $data,
            "cipher" => $cipher,
            "iv" => $iv
        ]);
        return [
            "env_key" => $env_key,
            "data" => $data,
            "cipher" => $cipher,
            "iv" => $iv
        ];
    }

    public function ipnRedirect(Request $request) {
        $order = Order::findOrFail($request->orderId); 
        // return view("processIpn", [
        //     "env_key" => $order->env_key,
        //     "data" => $order->data,
        //     "cipher" => $order->cipher,
        //     "iv" => $order->iv
        // ]);
        return redirect()->to("http://localhost:3000");
    }

    public function ipn(Request $request) {
        $errorType = PaymentAbstract::CONFIRM_ERROR_TYPE_NONE;
        $errorCode = 0;
        $errorMessage = '';
        $cipher     = 'rc4';
        $iv         = null;

        if(array_key_exists('cipher', $_POST))
        {
            $cipher = $_POST['cipher'];
            if(array_key_exists('iv', $_POST))
            {
                $iv = $_POST['iv'];
            }
        }

        if (strcasecmp($_SERVER['REQUEST_METHOD'], 'post') == 0){
            if(isset($_POST['env_key']) && isset($_POST['data'])){
                try {
                    $paymentRequestIpn = PaymentAbstract::factoryFromEncrypted(
                        $_POST['env_key'], 
                        $_POST['data'], 
                        $this->privateX509FilePath, 
                        null, 
                        $cipher, 
                        $iv
                    );
                    $rrn = $paymentRequestIpn->objPmNotify->rrn;
                    if ($paymentRequestIpn->objPmNotify->errorCode == 0) {
                        switch($paymentRequestIpn->objPmNotify->action){
                            case 'confirmed':
                                //update DB, SET status = "confirmed/captured"
                                error_log("confirmed");
                                $errorMessage = $paymentRequestIpn->objPmNotify->errorMessage;
                                break;
                            case 'confirmed_pending':
                                //update DB, SET status = "pending"
                                error_log("pending");
                                $errorMessage = $paymentRequestIpn->objPmNotify->errorMessage;
                                break;
                            case 'paid_pending':
                                error_log("paid_pending");
                                //update DB, SET status = "pending"
                                $errorMessage = $paymentRequestIpn->objPmNotify->errorMessage;
                                break;
                            case 'paid':
                                error_log("paid");
                                //update DB, SET status = "open/preauthorized"
                                $errorMessage = $paymentRequestIpn->objPmNotify->errorMessage;
                                break;
                            case 'canceled':
                                error_log("canceled");
                                //update DB, SET status = "canceled"
                                $errorMessage = $paymentRequestIpn->objPmNotify->errorMessage;
                                break;
                            case 'credit':
                                error_log("credit");
                                //update DB, SET status = "refunded"
                                $errorMessage = $paymentRequestIpn->objPmNotify->errorMessage;
                                break;
                            default:
                                $errorType = PaymentAbstract::CONFIRM_ERROR_TYPE_PERMANENT;
                                $errorCode = PaymentAbstract::ERROR_CONFIRM_INVALID_ACTION;
                                $errorMessage = 'mobilpay_refference_action paramaters is invalid';
                        }
                    }else{
                        //update DB, SET status = "rejected"
                        $errorMessage = $paymentRequestIpn->objPmNotify->errorMessage;
                    }
                }catch (\Exception $e) {
                    $errorType = PaymentAbstract::CONFIRM_ERROR_TYPE_TEMPORARY;
                    $errorCode = $e->getCode();
                    $errorMessage = $e->getMessage();
                }

            }else{
                $errorType = PaymentAbstract::CONFIRM_ERROR_TYPE_PERMANENT;
                $errorCode = PaymentAbstract::ERROR_CONFIRM_INVALID_POST_PARAMETERS;
                $errorMessage = 'mobilpay.ro posted invalid parameters';
            }

        } else {
            $errorType = PaymentAbstract::CONFIRM_ERROR_TYPE_PERMANENT;
            $errorCode = PaymentAbstract::ERROR_CONFIRM_INVALID_POST_METHOD;
            $errorMessage = 'invalid request method for payment confirmation';
        }

        /**
         * Communicate with NETOPIA Payments server
         */

        header('Content-type: application/xml');
        echo "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
        if($errorCode == 0)
        {
            echo "<crc>{$errorMessage}</crc>";
        }
        else
        {
            echo "<crc error_type=\"{$errorType}\" error_code=\"{$errorCode}\">{$errorMessage}</crc>";
        }
    }

    public function redirect(Request $request) {
        return $request;
    }
}
