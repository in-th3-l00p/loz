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

    public function update(Request $request) 
    {
        $data = $request->validate([
            // 'name' => ['bail', 'string', 'max:255'],
            // 'email' => ['bail', 'string', 'email', 'max:255', 'unique:'.User::class],
            // 'phone' => ["bail", "size:10"],
            "pfp" => "required"
        ]);

        $user = User::findOrFail(auth()->user()->id);
        $user->update($data);

        if (isset($data["pfp"])) {
            error_log("yeesss");
            $request->validate(["pfp" => "image|mimetypes:image/png"]);
            $path = "pfp/" . $user->id . ".png";
            if ($user->pfp_path !== null) {
                Storage::disk("public")->delete($path);
            } else {
                $user->update(["pfp_path" => "/storage/" . $path]);
            }
            Storage::disk("public")->put($path, $request->pfp->get());
        }
    }
}
