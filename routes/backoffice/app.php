<?php

use App\Http\Controllers\Backoffice\PatientController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Backoffice\AppointmentController;

Route::middleware('auth')->group(function () {
    Route::resource('patients', PatientController::class)->only('index');
    Route::get('appointments', [AppointmentController::class, 'index'])
    ->name('appointments.index');
    Route::post('appointments', [AppointmentController::class, 'store'])
    ->name('appointments.store');
});
