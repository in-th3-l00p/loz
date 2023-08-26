<?php

namespace Database\Factories;

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
            "map_id" => Map::all()->random()->id,
            "created_at" => now(),
            "updated_at" => now()
        ];
    }

    public function claimed(): LocationFactory
    {
        return $this->state(function (array $attributes) {
            $winner = fake()->boolean();

            return [
                "available" => false,
                "winner" => $winner,
                "winner_text" => $winner ? fake()->sentence(3) : null,
                "user_id" => User::all()->random()->id,
                "claimed_at" => now(),
            ];
        });
    }
}
