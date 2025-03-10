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

    public function save_request(): Response
    {
        return Inertia::render('requests/save_request');
    }

        public function queue_request(): Response
    {
        return Inertia::render('requests/queue_request');
    }

        public function for_recommendation(): Response
    {
        return Inertia::render('requests/for_recommendation');
    }

        public function on_process(): Response
    {
        return Inertia::render('requests/on_process');
    }

        public function pending_release(): Response
    {
        return Inertia::render('requests/pending_release');
    }

        public function released(): Response
    {
        return Inertia::render('requests/released');
    }

        public function report(): Response
    {
        return Inertia::render('requests/report');
    }


}
