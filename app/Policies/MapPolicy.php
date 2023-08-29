<?php

namespace App\Policies;

use App\Models\Map;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class MapPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Map $map): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->admin;
    }

    public function update(User $user, Map $map): bool
    {
        return $user->admin;
    }

    public function delete(User $user, Map $map): bool
    {
        return $user->admin;
    }

    public function restore(User $user, Map $map): bool
    {
        return $user->admin;
    }

    public function forceDelete(User $user, Map $map): bool
    {
        return $user->admin;
    }
}
