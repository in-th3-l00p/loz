<?php

namespace App\Http\Controllers;

use App\Http\Resources\MapResource;
use App\Models\Map;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MapController extends Controller
{
    public function index()
    {
        return MapResource::collection(Map::all()->load("locations"));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            "name" => "required|min:1|max:255|unique:maps,name",
            "width" => "required|numeric",
            "height" => "required|numeric",
            "image" => "required",
        ]);

        $path = "maps/" . $data["name"] . ".png";
        $map = new Map();
        $map->name = $data["name"];
        $map->width = $data["width"];
        $map->height = $data["height"];
        $map->img_path = $path;
        $map->save(); 
        Storage::disk("public")
            ->put($path, base64_decode(explode(",", $data["image"])[1]));
        return $map;
    }

    public function show(Map $map)
    {
        return new MapResource($map->load("locations"));
    }

    public function update(Request $request, Map $map)
    {
        //
    }

    public function destroy(Map $map)
    {
        //
    }
}
