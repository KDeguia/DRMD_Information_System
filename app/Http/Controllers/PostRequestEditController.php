<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PostRequest;

class PostRequestEditController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(PostRequest $post_request)
    {
        return inertia('requests/edit', [
            'currentRequest' => $post_request,
        ]);
    }
}
