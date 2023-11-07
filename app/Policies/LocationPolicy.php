<?php

namespace App\Policies;

use App\Models\Location;
use App\Models\Map;
use App\Models\User;

class LocationPolicy
{
    public function __construct()
    {
    }

    public function admin_show(User $user, Location $location) {
        return true;
    }

    public function claim_location(User $user, Location $location) {
        return $location->available;
    }

    public function set_location_image(User $user, Location $location) {
        return !$location->available && $location->user_id === $user->id;
    }

    public function scratch_location(User $user, Location $location) {
        return !$location->available && $location->user_id === $user->id && !$location->scratched;
    }

    public function admin_update(User $user, Location $location) {
        return $location->user_id === null && $user->admin;
    }

    public function owned_location(User $user) {
        return true;
    }
}
