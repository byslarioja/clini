<?php

namespace Database\Seeders\Specialties;

use Illuminate\Database\Seeder;
use App\Models\Specialty;

class SpecialtySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Specialty::create(['name' => 'Cardiología']);
        Specialty::create(['name' => 'Dermatología']);
        Specialty::create(['name' => 'Pediatría']);
    }
}
