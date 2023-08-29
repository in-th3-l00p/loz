<?php

namespace App\Policies;

use App\Models\Location;
use App\Models\Map;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class LocationPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Map $map, Location $location): bool
    {
        return $location->map_id === $map->id;
    }

    public function create(?User $user): bool
    {
        return false;
    }

    public function update(?User $user, Location $location): bool
    {
        return $user->admin;
    }

    public function delete(?User $user, Location $location): bool
    {
        return false;
    }

    public function restore(?User $user, Location $location): bool
    {
        return false;
    }

    public function forceDelete(?User $user, Location $location): bool
    {
        return false;
    }

    public function claim(?User $user, Map $map, Location $location): bool {
        error_log("test");
        return $location->available && $location->map_id === $map->id;
    }
}
