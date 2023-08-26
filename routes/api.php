<?php

use App\Http\Controllers\MapController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::post("/login", function (Request $request) {
    $credentials = $request->validate([
        "email" => "required|email",
        "password" => "required",
    ]);

    if (!Auth::attempt($credentials))
        return response()->json([
            "message" => "Invalid credentials",
        ], 401);
    $user = User::where("email", $request->email)->first();
    return response()->json([
        "token" => $user->createToken("API Token")->plainTextToken
    ]);
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get("users", );
    Route::apiResource("maps", MapController::class);
});