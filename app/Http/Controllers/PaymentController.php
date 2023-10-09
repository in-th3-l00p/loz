<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\Map;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Netopia\Payment\Address;
use Netopia\Payment\Invoice;
use Netopia\Payment\Request\Card;

class PaymentController extends Controller
{
    public $paymentUrl = "http://sandboxsecure.mobilpay.ro";
    public $x509FilePath = "/var/www/html/sandbox.2WTM-EA5C-J0BK-NE1X-C5V5.public.cer";

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
            if (!$location->available || $location->processed)
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
            $item["location"]->update([ "processed" => true ]);
            $cost += $item["location"]->price;
        }

        $paymentRequest = new Card();
        $paymentRequest->signature = "2WTM-EA5C-J0BK-NE1X-C5V5";
        $paymentRequest->orderId = md5(uniqid(rand()));
        $paymentRequest->confirmUrl = "http://localhost:3000";
        $paymentRequest->returnUrl = "http://localhost/ipn";

        $paymentRequest->invoice = new Invoice();
        $paymentRequest->invoice->currency = "RON";
        $paymentRequest->invoice->amount = $cost;
        $paymentRequest->invoice->tokenId = null;
        $paymentRequest->invoice->details = "Cumpara lozuri";

        $billingAddress = new Address();
        $billingAddress->type = $request->type;
        $billingAddress->firstName = $request->firstName;
        $billingAddress->lastName = $request->lastName;
        $billingAddress->address = $request->address;
        $billingAddress->email = $request->email;
        $billingAddress->mobilePhone = $request->mobilePhone;
        $paymentRequest->invoice->setBillingAddress($billingAddress);

        $paymentRequest->encrypt($this->x509FilePath);
        $env_key = $paymentRequest->getEnvKey();
        $data = $paymentRequest->getEncData();
        $cipher = $paymentRequest->getCipher();
        $iv = $paymentRequest->getIv();
        error_log($env_key);
        error_log($data);
        error_log($cipher);
        error_log($iv);
        $resp = Http::asForm()->post($this->paymentUrl, [
            "env_key" => $env_key,
            "data" => $data,
            "cipher" => $cipher,
            "iv" => $iv
        ]);

        foreach ($items as $item) {
            $item["location"]->update([ "processed" => false ]);
        }

        return $resp;
    }
}
