<?php

namespace App\Http\Controllers\Backoffice;

use App\Http\Controllers\Controller;
use App\Http\Requests\Backoffice\PaginatedPatientsRequest;
use App\Http\Resources\Backoffice\PatientResource;
use App\Models\Patient;
use Inertia\Inertia;

class PatientController extends Controller
{
    public function index(PaginatedPatientsRequest $request): \Inertia\Response
    {
        $query = $request->validated();

        $patients = Patient::query()
            ->where(function ($q) use ($query) {
                $search = $query['filter'];

                return $q->where('name', 'like', "%$search%")
                    ->orWhere('dni', 'like', "%$search%")
                    ->orWhere('phone', 'like', "%$search%");
            })
            ->orderBy($query['sort_column'], $query['sort_order'])
            ->paginate($query['per_page'], page: $query['page']);

        return Inertia::render('patients/index', [
            'patients' => PatientResource::collection($patients),
        ]);
    }
}
