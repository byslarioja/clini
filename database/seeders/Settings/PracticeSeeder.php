<?php

namespace Database\Seeders\Settings;

use App\Models\Address;
use App\Models\Practice;
use App\Models\Professional;
use App\Models\Specialty;
use App\Models\User;
use Illuminate\Database\Seeder;

class PracticeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'User Consultorio A',
            'email' => 'user@consultorio-a.com',
        ]);

        $professional = Professional::create([
            'user_id' => $user->id,
            'dni' => '37415820',
            'mu' => '37415820',
            'phone' => '3212132312',
            'specialty_id' => Specialty::first()->id,
        ]);

        $address = Address::create([
            'address_line' => 'direccion',
        ]);

        $practice = Practice::create([
            'name' => 'consultorio A',
            'phone' => '3212132312',
            'logo' => 'https://placehold.co/600x400',
            'address_id' => $address->id,
        ]);

        $user->practices()->attach($practice);
        $user->professional()->save($professional);
    }
}
