<?php

namespace App\Http\Controllers;

use App\Models\PostRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\RedirectResponse;

class PostRequestDestroyController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(PostRequest $post_request): RedirectResponse
    {
        // OPTIONAL: Authorize the user
        // $this->authorize('delete', $post_request);

        // Delete the PDF if it exists in storage
        if ($post_request->pdf_file && Storage::disk('public')->exists($post_request->pdf_file)) {
            Storage::disk('public')->delete($post_request->pdf_file);
        }

        // Delete the post request record
        $post_request->delete();

        // Redirect back with a success flash message
        return redirect()
            ->route('posts_request.index')
            ->with('success', 'Post request deleted successfully.');
    }
}
