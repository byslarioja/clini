<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppointmentState extends Model
{
    public function appointments()
    {
        return $this->belongsToMany(Appointment::class)->withTimestamps();
    }
}
