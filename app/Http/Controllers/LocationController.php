<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\Map;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function index(Map $map)
    {
        return $map->load("locations")->locations;
    }

    public function store(Request $request, Map $map)
    {
        $data = $request->validate([
            "x" => "requried|numeric",
            "y" => "requried|numeric",
            "width" => "requried|numeric",
            "height" => "requried|numeric"
        ]);

        Location::factory()->create([
            ...$data,
            "map_id" => $map->id
        ]);
    }

    public function show(Location $location)
    {
        return $location;
    }

    public function update(Request $request, Location $location)
    {
        $location->update($request->validate([
            "available" => "bail|boolean|nullable",
            "winner" => "bail|boolean|nullable",
            "winner_text" => "bail|nullable|alpha_num",
            "action_end" => "bail|date|nullable",
            "min_price" => "bail|numeric|nullable",
            "max_price" => "bail|numeric|nullable"
        ]));
    }

    public function destroy(Location $location)
    {
        $location->delete();
    }
}
