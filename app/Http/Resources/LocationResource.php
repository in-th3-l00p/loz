<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LocationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $status = "available";
        if (!$this->available) {
            if ($this->user_id !== null) {
                if ($this->scratched)
                    $status = $this->winner ? "winner" : "not winner";
                else
                    $status = "claimed";
            } else
                $status = "unavailable";
        }

        return [
            "id" => $this->id,
            "map_id" => $this->map_id,
            "points" => [
                [$this->x, $this->y], 
                [$this->x + $this->width, $this->y], 
                [$this->x + $this-> width, $this->y + $this->height],
                [$this->x, $this->y + $this->height]
            ],
            "status" => $status,
            "price" => $this->price,
            "image_path" => $this->when(!$this->available, $this->whenNotNull($this->image_path)),
            "winner_text" => $this->when(!$this->available, $this->whenNotNull($this->winner_text)),
            "claimed_by" => $this->whenNotNull($this->user_id),
            "claimed_at" => $this->whenNotNull($this->claimed_at)
        ];
    }
}
