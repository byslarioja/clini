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
        $roles = [
            'Administrador',
            'Profesional',
            'Secretaria',
        ];

        foreach ($roles as $role) {
            DB::insert('INSERT INTO roles(name, created_at) VALUES (:name, :created_at)', [
                'name' => $role,
                'created_at' => new DateTime,
            ]);
        }
    }
};
