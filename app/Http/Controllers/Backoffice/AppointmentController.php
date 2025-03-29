<?php

namespace App\Http\Controllers\Backoffice;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Patient;
use App\Models\Professional;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Resources\Backoffice\ProfessionalResource;

class AppointmentController extends Controller
{
    public function index(): \Inertia\Response
    {
        $patients = Patient::all();

        return Inertia::render('appointments/index', [
            'patients' => $patients,
            'professionals' => ProfessionalResource::collection(
                Professional::with('user')->get()
            ),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'date'             => 'required|date',
            'time'             => 'required',
            'duration'         => 'required|numeric',
            'phone'            => 'required',
            'reason'           => 'required|string',
            'patient_id'       => 'required|exists:patients,id',
            'professional_id'  => 'required|exists:professionals,id',
        ]);

        $appointment = Appointment::create($validated);

        $appointment->states()->attach(3);

        return redirect()
            ->route('appointments.index')
            ->with('success', '¡Turno creado correctamente!');
    }
}
