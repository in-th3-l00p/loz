<?php

namespace App\Http\Controllers;

use App\Http\Resources\MapResource;
use App\Models\Map;
use Illuminate\Http\Request;
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
            "name" => "required|min:1|max:255",
            "width" => "required|numeric",
            "height" => "required|numeric",
            "image" => "required|image|mimetypes:image/png"
        ]);

        $map = new Map();
        $map->name = $data["name"];
        $map->width = $data["width"];
        $map->height = $data["height"];
        $map->img_path = "/storage/maps/" . $data["name"] . ".png";
        $map->save();
        Storage::disk("public")->put("/maps/" . $map->name . ".png", $data["image"]->get());
    }

    public function show(Map $map)
    {
        return new MapResource($map->load("locations"));
    }

    public function update(Request $request, Map $map)
    {
        if ($request->hasFile("image")) {
            $request->validate([
                "image" => "required|image|mimetypes:image/png"
            ]);

            Storage::disk("public")->put("/maps/" . $map->name . ".png", $request->image->get());
        }

        $map->update($request->validate([
            "width" => "bail|numeric",
            "height" => "bail|numeric"
        ]));
    }

    public function destroy(Map $map)
    {
        $map->delete();
    }
}
