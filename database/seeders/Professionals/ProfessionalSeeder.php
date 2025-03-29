<?php

namespace Database\Seeders\Professionals;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Professional;

class ProfessionalSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::where('email', 'test@example.com')->first();

        if ($user) {
            Professional::create([
                'dni' => '12345678',
                'mu' => 'MU-001',
                'phone' => '555-1234',
                'specialty_id' => 1,
                'user_id' => $user->id,
            ]);
        }
    }
}
