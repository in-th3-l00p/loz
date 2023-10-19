<?php

namespace App\Http\Controllers;

use App\Http\Resources\MapResource;
use App\Models\Location;
use App\Models\Map;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

class MapController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Map::class);
    }

    public function index()
    {
        return MapResource::collection(Map::all(["*"]));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            "name" => "required|min:1|max:255|unique:maps,name",
            "rectangles" => "required|numeric"
        ]);

        $resp = Http::get("polygon:8001", [
            "rectangles" => $data["rectangles"]
        ]);
        if ($resp->status() !== 200)
            return response(null, 500);
        $map = new Map();
        $map->name = $data["name"];
        $map->save();

        foreach ($resp->json() as $coords) {
            $location = new Location;
            $location->x = $coords[0];
            $location->y = $coords[1];
            $location->width = $coords[2];
            $location->height = $coords[3];
            $location->map_id = $map->id;
            $location->save();
        }
    }

    public function show(Map $map)
    {
        return new MapResource($map->load("locations"));
    }

    public function destroy(Map $map)
    {
        $map->delete();
    }
}
