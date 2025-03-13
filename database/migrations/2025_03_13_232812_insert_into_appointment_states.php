<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $states = [
            'Completado',
            'Cancelado',
            'Pendiente',
            'Reprogramado',
        ];

        foreach ($states as $state) {
            DB::insert('INSERT INTO appointment_states (name, created_at) VALUES (:name, :created_at)', [
                'name' => $state,
                'created_at' => new DateTime,
            ]);
        }
    }
};
