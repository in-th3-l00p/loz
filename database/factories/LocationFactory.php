<?php

namespace Database\Factories;

use App\Models\Location;
use App\Models\Map;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Location>
 */
class LocationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "x" => fake()->numberBetween(0, 1000),
            "y" => fake()->numberBetween(0, 1000),
            "width" => fake()->numberBetween(0, 100),
            "height" => fake()->numberBetween(0, 100),
            "map_id" => Map::all(["*"])->random()->id,
            "created_at" => now(),
            "updated_at" => now()
        ];
    }

    public function claimed(): LocationFactory
    {
        return $this->state(fn (array $attributes) => [
            "available" => false,
            "user_id" => User::all(["*"])->random()->id,
            "claimed_at" => now()
        ]);
    }

    public function winner(): LocationFactory 
    {
        return $this->state(fn (array $attributes) => [
            "available" => false,
            "scratched" => true,
            "scratched_at" => now(),
            "winner" => true,
            "winner_text" => fake()->sentence(3),
            "user_id" => User::all(["*"])->random()->id,
            "claimed_at" => now(),
            "image_path" => "/storage/locations/default.png"
        ]);
    }

    public function loser(): LocationFactory 
    {
        return $this->state(fn (array $attributes) => [
            "available" => false,
            "scratched" => true,
            "scratched_at" => now(),
            "winner" => false,
            "user_id" => User::all(["*"])->random()->id,
            "claimed_at" => now(),
            "image_path" => "/storage/locations/default.png"
        ]);
    }

    public function notAvailable(): LocationFactory 
    {
        return $this->state(fn (array $attributes) => [
            "available" => false
        ]);
    }

    public function firstMap(): LocationFactory
    {
        return $this->state(fn (array $attributes) => [
            "map_id" => 1
        ]);
    }
}
