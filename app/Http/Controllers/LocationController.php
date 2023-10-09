<?php

namespace App\Http\Controllers;

use App\Http\Resources\AdminLocationResource;
use App\Http\Resources\LocationResource;
use App\Models\Location;
use App\Models\Map;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class LocationController extends Controller
{
    public function __construct() {
    }

    public function show(Map $map, Location $location) {
        return new LocationResource($location);
    }

    public function adminShow(Map $map, Location $location) {
        $this->authorize("admin_show", $location);
        return new AdminLocationResource($location);
    }

    public function claim(Map $map, Location $location, Request $request) {
        $this->authorize("claim_location", $location);
        $location->update([
            "available" => false,
            "claimed_at" => now(),
            "user_id" => auth()->user()->getAuthIdentifier()
        ]);
    }

    public function scratch(Map $map, Location $location) {
        $this->authorize("scratch_location", $location);
        $location->update([
            "scratched" => true,
            "scratched_at" => now()
        ]);
    }

    public function setImage(Map $map, Location $location, Request $request) {
        $this->authorize("set_location_image", $location);

        $request->validate([
            "image" => "required|image|mimetypes:image/png"
        ]);
        Storage::disk("public")->put(
            "locations/" . $location->id . ".png",
            $request->image->get()
        );
        $location->update([
            "image_path" => "/storage/locations/" . $location->id . ".png"
        ]);
    }

    public function adminUpdate(Map $map, Location $location, Request $request) {
        $this->authorize("admin_update", $location);

        if ($request->available === true) {
            $location->update($request->validate([
                "available" => "required|boolean",
                "winner" => "bail|boolean",
                "winner_text" => "bail|nullable"
            ]));
            return;
        }

        $location->update($request->validate([
            "available" => "required|boolean"
        ]));
    }
}
