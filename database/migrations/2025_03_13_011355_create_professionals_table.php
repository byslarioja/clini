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
        Schema::create('professionals', function (Blueprint $table) {
            $table->id();
            $table->string('dni');
            $table->string('mu');
            $table->string('phone');
            $table->foreignId('specialty_id')->constrained();
            $table->timestamps();
        });
    }
};
