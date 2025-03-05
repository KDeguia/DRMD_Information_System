<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('new_request', function () {
        return Inertia::render('new_request');
    })->name('new request');

        Route::get('queue_request', function () {
        return Inertia::render('queue_request');
    })->name('queue request');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/request.php';
