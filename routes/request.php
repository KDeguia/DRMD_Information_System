<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {

        Route::get('request/new_request', function () {
        return Inertia::render('request/new_request');
    })->name('new request');

        Route::get('request/queue_request', function () {
        return Inertia::render('request/queue_request');
    })->name('queue request');
});
