<?php

use App\Http\Controllers\Requests\RequestsController;
use App\Http\Controllers\AddressController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\PostRequestIndexController;
use App\Http\Controllers\PostRequestStoreController;
use App\Http\Controllers\PostRequestEditController;
use App\Http\Controllers\PostRequestUpdateController;
use App\Http\Controllers\PostRequestDestroyController;
use Illuminate\Support\Facades\Route;




Route::middleware('auth')->group(function () {
    Route::redirect('requests', 'requests/new_request');

    // Route::get('new_request', [RequestsController::class, 'create_request'])->name('new.request');
    Route::resource('posts', PostController::class);
    Route::resource('new_request', RequestsController::class);


    Route::get('queue_request', [RequestsController::class, 'queue_request'])->name('queue.request');
    Route::get('for_recommendation', [RequestsController::class, 'for_recommendation'])->name('for_recommendation.request');
    Route::get('on_process', [RequestsController::class, 'on_process'])->name('on_process.request');
    Route::get('pending_release', [RequestsController::class, 'pending_release'])->name('pending_release.request');
    Route::get('released', [RequestsController::class, 'released'])->name('released.request');
    Route::get('report', [RequestsController::class, 'report'])->name('report.request');

    Route::get('/provinces', [AddressController::class, 'getProvinces']);
    Route::get('/municipalities/{province}', [AddressController::class, 'getMunicipalities']);
    Route::get('/barangays/{municipality}', [AddressController::class, 'getBarangays']);

    Route::get('posts_request', PostRequestIndexController::class)->name('posts_request.index');
    Route::inertia('posts_request/create', 'requests/create')->name('posts_request.create');
    Route::post('posts_request', PostRequestStoreController::class)->name('posts_request.store');
    Route::get('posts_request/{post_request}/edit', PostRequestEditController::class)->name('posts_request.edit');
    Route::put('posts_request/{post_request}', PostRequestUpdateController::class)->name('posts_request.update');
    Route::delete('posts_request/{post_request}', PostRequestDestroyController::class)->name('posts_request.destroy');
}


);
