<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Map>
 */
class MapFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "name" => fake()->sentence(3),
            "img_path" => "maps/1.png",
            "width" => 1000,
            "height" => 1000,
            "created_at" => now(),
            "updated_at" => now()
        ];
    }
}
