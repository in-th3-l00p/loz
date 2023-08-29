<?php

namespace App\Http\Controllers;

use App\Http\Resources\LocationResource;
use App\Models\Location;
use App\Models\Map;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function __construct() {
    }

    public function index() { }

    public function store(Request $request) { }

    public function show($map, $location)
    {
        $map = Map::findOrFail($map);
        $location = Location::findOrFail($location);
        return new LocationResource($location);
    }

    public function update(Request $request, Location $location)
    {
        $request->validate(["winner" => "required|boolean"]);
        if ($request->winner) {
            $request->validate(["winner_text" => "required"]);
            $location->update([
                "winner" => $request->winner,
                "winner_text" => $request->winner_text
            ]);
        } else {
            $location->update([ "winner" => $request->winner ]);
        }
    }

    public function claim(string $map, string $location, Request $request) {
        $map = Map::findOrFail($map);
        $location = Location::findOrFail($location);
        if (!$location->available) {
            abort(403);
        }

        $location->update([
            "available" => false,
            "claimed_at" => now(),
            "user_id" => auth()->user()->id
        ]);
    }

    public function destroy(Location $location) { }
}
