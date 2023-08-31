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
        if (!$this->available)
            $status = $this->winner ? "winner" : "not winner";
        return [
            "id" => $this->id,
            "points" => [
                [$this->x, $this->y], 
                [$this->x + $this->width, $this->y], 
                [$this->x + $this-> width, $this->y + $this->height],
                [$this->x, $this->y + $this->height]
            ],
            "status" => $status,
            "winner_text" => $this->when(!$this->available, $this->whenNotNull($this->winner_text)),
            "claimed_by" => $this->whenNotNull($this->user_id),
            "claimed_at" => $this->whenNotNull($this->claimed_at)
        ];
    }
}
