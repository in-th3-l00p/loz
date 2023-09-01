<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function show(User $user)
    {
        return $user;
    }

    public function showAuthenticated() {
        return User::find(auth()->user()->getAuthIdentifier());
    }

    public function setProfilePicture(Request $request, User $user)
    {
        $data = $request->validate([
            "image" => "required|image|mimetypes:image/png"
        ]);

        $path = "pfp/" . $user->id . ".png";
        if ($user->pfp_path === null)
            $user->update(["pfp_path" => "/storage/" . $path]);
        Storage::disk("public")->put($path, $request->image->get());
    }
}
