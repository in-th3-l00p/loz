<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;
    
    protected $fillable = [
        "available",
        "user_id",
        "claimed_at"
    ];

    protected function map() {
        return $this->belongsTo(Map::class);
    }

    protected function user() {
        return $this->belongsTo(User::class);
    }

    protected function bids() {
        return $this->hasMany(Bid::class);
    }
}
