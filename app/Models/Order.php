<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    
    protected $fillable = [
        "status", "amount", "currency", "description", "billable", "billing_address",
        "env_key", "data", "cipher", "iv"
    ];

    public function location() {
        return $this->belongsTo(Location::class);
    }
}
