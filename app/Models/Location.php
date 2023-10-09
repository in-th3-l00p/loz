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
        "claimed_at",
        "image_path",
        "scratched",
        "scratched_at",
        "order_id",
        "winner",
        "winner_text"
    ];

    public function map() {
        return $this->belongsTo(Map::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function bids() {
        return $this->hasMany(Bid::class);
    }

    public function order() {
        return $this->hasOne(Order::class);
    }
}
