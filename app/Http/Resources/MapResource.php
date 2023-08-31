<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MapResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "name" => $this->name,
            "width" => $this->width,
            "height" => $this->height,
            "locations" => LocationResource::collection($this->whenLoaded("locations"))
        ];
    }
}
