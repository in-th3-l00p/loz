<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminLocationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "points" => [
                [$this->x, $this->y], 
                [$this->x + $this->width, $this->y], 
                [$this->x + $this-> width, $this->y + $this->height],
                [$this->x, $this->y + $this->height]
            ],
            "available" => $this->available,
            "winner" => $this->winner,
            "price" => $this->price,
            "image_path" => $this->image_path,
            "winner_text" => $this->winner_text,
            "claimed_by" => $this->user_id,
            "claimed_at" => $this->claimed_at
        ];
    }
}
