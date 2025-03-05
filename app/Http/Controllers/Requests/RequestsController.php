<?php

namespace App\Http\Controllers\Requests;

use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RequestsController extends Controller
{
    //

        public function create_request(): Response
    {
        return Inertia::render('requests/new_request');
    }

        public function queue_request(): Response
    {
        return Inertia::render('requests/queue_request');
    }


}
