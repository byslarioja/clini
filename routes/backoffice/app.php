<?php

use App\Http\Controllers\Backoffice\PatientController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::resource('patients', PatientController::class)->only('index');
});
