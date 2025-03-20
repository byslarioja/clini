<?php

namespace App\Http\Controllers\Backoffice;

use App\Http\Controllers\Controller;
use App\Http\Resources\Backoffice\PatientResource;
use App\Models\Patient;
use Inertia\Inertia;

class PatientController extends Controller
{
    public function index(): \Inertia\Response
    {
        $patients = Patient::paginate(20);

        return Inertia::render('patients/index', [
            'patients' => PatientResource::collection($patients),
        ]);
    }
}
