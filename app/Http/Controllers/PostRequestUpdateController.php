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
            'type_of_disaster' => 'required|string|max:255',
            'purpose' => 'required|string|max:255',
            'pdf_file' => 'nullable|file|mimes:pdf|max:5120',
            'date_of_request' => 'required|string|max:255',


        ]);

        // Optional: slugify or sanitize
        $data['type_of_disaster'] = str($data['type_of_disaster'])->slug();

        // Preserve existing file path unless a new one is uploaded
        $data['pdf_file'] = $post_request->pdf_file;

        if ($request->hasFile('pdf_file')) {
            // Delete old file
            if ($post_request->pdf_file) {
                Storage::disk('public')->delete($post_request->pdf_file);
            }

            // Upload new file
            $data['pdf_file'] = $request->file('pdf_file')->store('posts_request', 'public');
        }

        $post_request->update($data);

        // ✅ Flash a success message to the session
        return to_route('posts_request.index')->with('updated', 'Post request updated successfully!');
    }
}
