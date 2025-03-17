<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Practice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PracticeController extends Controller
{
    public function edit(Request $request)
    {
        $user = $request->user();

        $practice = Practice::query()
            ->with(['address'])
            ->whereHas('users', function ($query) use ($user) {
                return $query->where('users.id', $user->id);
            })->first(); // TODO: choose criteria to get current practice

        return Inertia::render('settings/practice', [
            'practice' => $practice,
        ]);
    }

    public function update(Request $request, Practice $practice): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:10'],
            'address_line' => ['required', 'string', 'max:255'],
        ]);

        DB::transaction(function () use ($practice, $validated) {
            $practice->update([
                'name' => $validated['name'],
                'phone' => $validated['phone'],
            ]);

            $practice->address()->update([
                'address_line' => $validated['address_line'],
            ]);
        });

        return back()->with([
            'message' => [
                'content' => 'Consultorio actualizado con éxito',
                'type' => 'success',
            ],
        ]);
    }
}
