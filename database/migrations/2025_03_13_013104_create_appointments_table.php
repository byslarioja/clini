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
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->string('duration');
            $table->string('reason');
            $table->date('date');
            $table->time('time')->nullable();
            $table->foreignId('professional_id')->constrained();
            $table->foreignId('patient_id')->constrained();
            $table->timestamps();
        });
    }
};
