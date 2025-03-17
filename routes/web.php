<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AddressController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

Route::get('/provinces', [AddressController::class, 'provinces']);
Route::get('/provinces/{province}/municipalities', [AddressController::class, 'municipalities']);
Route::get('/municipalities/{municipality}/barangays', [AddressController::class, 'barangays']);

});
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/requests.php';
