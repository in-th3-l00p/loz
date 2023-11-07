<?php

use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

Route::middleware("auth:sanctum")->group(function () {
    Route::post(
        "/payment/submit",
        [PaymentController::class, "submit"]
    )->name("payment.submit");

    Route::get(
        "/payment/ipn",
        [PaymentController::class, "ipnRedirect"]
    )->name("payment.ipn.redirect");
    Route::post(
        "/payment/ipn",
        [PaymentController::class, "ipn"]
    )->name("payment.ipn.process");
});

require __DIR__.'/auth.php';
