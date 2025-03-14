<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PostRequest;
use App\Http\Resources\PostRequestResource;

class PostRequestEditController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(PostRequest $post_request)
    {
        return inertia('requests/edit', [
            'currentRequest' => new PostRequestResource($post_request),
        ]);
    }
}
