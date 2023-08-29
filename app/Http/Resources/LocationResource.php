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
        return [
            "id" => $this->id,
            "points" => [
                $this->x, $this->y, 
                $this->x + $this->width, 
                $this->y + $this->height
            ],
            "available" => $this->available,
            "claimed_by" => $this->whenNotNull($this->user_id),
            "winner" => $this->when(!$this->available, $this->winner),
            "winner_text" => $this->when(!$this->available, $this->whenNotNull($this->winner_text)),
            "claimed_at" => $this->whenNotNull($this->claimed_at)
        ];
    }
}
