<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Resources\PostRequestResource;

class PostRequestIndexController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $posts_request = $request->user()->posts_request()->get();

        return Inertia::render('requests/index', [
            'posts_request' => PostRequestResource::collection($posts_request)
        ]);
    }
}
