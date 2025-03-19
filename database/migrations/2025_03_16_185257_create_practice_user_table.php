<?php

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
        Schema::create('practice_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('practice_id')->constrained();
            $table->foreignId('user_id')->constrained();
            $table->timestamps();
        });
    }
};
