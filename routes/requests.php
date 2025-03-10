<?php

use App\Http\Controllers\Requests\RequestsController;
use App\Http\Controllers\AddressController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::middleware('auth')->group(function () {
    // Route::redirect('requests', 'requests/new_request');

    Route::get('new_request', [RequestsController::class, 'create_request'])->name('new.request');
    Route::get('queue_request', [RequestsController::class, 'queue_request'])->name('queue.request');
    Route::get('for_recommendation', [RequestsController::class, 'for_recommendation'])->name('for_recommendation.request');
    Route::get('on_process', [RequestsController::class, 'on_process'])->name('on_process.request');
    Route::get('pending_release', [RequestsController::class, 'pending_release'])->name('pending_release.request');
    Route::get('released', [RequestsController::class, 'released'])->name('released.request');
    Route::get('report', [RequestsController::class, 'report'])->name('report.request');

    Route::get('/provinces', [AddressController::class, 'getProvinces']);
    Route::get('/municipalities/{province}', [AddressController::class, 'getMunicipalities']);
    Route::get('/barangays/{municipality}', [AddressController::class, 'getBarangays']);
}


);
