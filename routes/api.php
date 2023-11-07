<?php

use App\Http\Controllers\LocationController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\UserController;
use App\Models\Location;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

// postman login
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

Route::get("/users/{user}", [UserController::class, "show"]);
Route::apiResource("maps", MapController::class)->only(["index", "show"]);
Route::apiResource("maps.locations", LocationController::class)->only(["show"])->scoped();

Route::middleware("auth:sanctum")->group(function () {
    Route::get("/user", [UserController::class, "showAuthenticated"]);
    Route::post("/users/setProfilePicture", [UserController::class, "setProfilePicture"]);

    Route::apiResource("maps", MapController::class)
        ->except(["index", "show", "update"]);

    Route::get("/locations", [LocationController::class, "index"])
        ->name("locations.owned");
    Route::put(
        "/maps/{map}/locations/{location}/claim",
        [LocationController::class, "claim"]
    )->name("maps.locations.claim");
    Route::put(
        "/maps/{map}/locations/{location}/scratch",
        [LocationController::class, "scratch"]
    )->name("maps.locations.scratch");
    Route::post(
        "/maps/{map}/locations/{location}/image",
        [LocationController::class, "setImage"]
    )->name("maps.locations.image");

    Route::prefix("/admin")->group(function() {
        Route::get(
            "/maps/{map}/locations/{location}",
            [LocationController::class, "adminShow"]
        )->name("admin.maps.locations.adminShow");

        Route::put(
            "/maps/{map}/locations/{location}",
            [LocationController::class, "adminUpdate"]
        )->name("admin.maps.locations.adminUpdate");
    });
});
