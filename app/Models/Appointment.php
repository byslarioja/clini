<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'duration',
        'reason',
        'date',
        'time',
        'professional_id',
        'patient_id',
    ];

    public function professional()
    {
        return $this->belongsTo(Professional::class);
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function states()
    {
        return $this->belongsToMany(AppointmentState::class)->withTimestamps();
    }

}
