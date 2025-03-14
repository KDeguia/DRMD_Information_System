<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\PostRequest;

class PostRequestIndexController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $posts_request = PostRequest::all();

        return Inertia::render('requests/index', [
            'posts_request' => $posts_request,
        ]);
    }
}
