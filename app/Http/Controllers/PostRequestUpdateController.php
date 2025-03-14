<?php

namespace App\Http\Controllers;

use App\Models\PostRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class PostRequestUpdateController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request, PostRequest $post_request)
    {
        $data = $request->validate([
            'type_of_disaster' => 'required',
            'purpose' => 'required',
            'pdf_file' => 'nullable|file|mimes:pdf|max:5120',
        ]);

        // Optional: slugify or sanitize
        $data['type_of_disaster'] = str($data['type_of_disaster'])->slug();

        // Preserve existing file path unless a new one is uploaded
        $data['pdf_file'] = $post_request->pdf_file;

        if ($request->hasFile('pdf_file')) {
            // Delete old file
            Storage::disk('public')->delete($post_request->pdf_file);

            // Upload new file
            $data['pdf_file'] = Storage::disk('public')->put('posts_request', $request->file('pdf_file'));
        }

        // ✅ THIS IS THE FIX: update the model, not the request!
        $post_request->update($data);

        // Redirect back
        return to_route('posts_request.index')->with('success', 'Post request updated successfully!');
    }
}
