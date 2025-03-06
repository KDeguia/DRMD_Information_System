<?php

use App\Http\Controllers\Requests\RequestsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::middleware('auth')->group(function () {
    // Route::redirect('requests', 'requests/new_request');

    Route::get('new_request', [RequestsController::class, 'create_request'])->name('new.request');
    Route::get('queue_request', [RequestsController::class, 'queue_request'])->name('queue.request');
    Route::get('for_recommendation', [RequestsController::class, 'for_recommendation'])->name('for_recommendation.request');

});
