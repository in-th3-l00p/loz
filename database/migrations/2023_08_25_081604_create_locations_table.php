<?php

use App\Models\Bid;
use App\Models\Map;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->double("x");
            $table->double("y");
            $table->double("width");
            $table->double("height");
            $table->foreignIdFor(Map::class);

            $table->double("price")->default(100);
            $table->boolean("available")->default(true);
            $table->string("image_path")->nullable();
            $table->boolean("scratched")->default(false);
            $table->dateTime("scratched_at")->nullable();

            $table->boolean("winner")->default(false);
            $table->string("winner_text")->nullable();

            $table->foreignIdFor(User::class)->nullable();
            $table->dateTime("claimed_at")->nullable();

            $table->foreignIdFor(Bid::class, "winning_bid")->nullable();
            $table->dateTime("action_end")->nullable();
            $table->double("min_price")->nullable();
            $table->double("max_price")->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};
