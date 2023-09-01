<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        \App\Models\User::factory(10)->create();
        \App\Models\User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
        \App\Models\User::factory()->admin()->create([
            'name' => 'Admin',
            'email' => 'admin@email.com',
        ]);

        \App\Models\Map::factory(5)->create();

        \App\Models\Location::factory(100)->create();
        \App\Models\Location::factory(100)->claimed()->create();
        \App\Models\Location::factory(50)->notAvailable()->create();

        \App\Models\Location::factory(40)->firstMap()->create();
        \App\Models\Location::factory(40)->firstMap()->claimed()->create();
        \App\Models\Location::factory(20)->firstMap()->notAvailable()->create();
    }
}
