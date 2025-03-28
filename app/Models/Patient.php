<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Model;

/**
 * @property-read int $id
 * @property-read string $name
 * @property-read string $phone
 * @property-read string $sex
 * @property-read string $dni
 * @property-read CarbonImmutable $dob
 * @property-read CarbonImmutable $created_at
 * @property-read CarbonImmutable $updated_at
 */
class Patient extends Model
{
    protected $casts = [
        'dob' => 'date',
    ];
}
