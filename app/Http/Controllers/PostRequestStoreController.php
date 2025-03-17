<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PostRequestStoreController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $data = $request->validate([
            'type_of_disaster' => 'required',
            'purpose' => 'required',
            'pdf_file' => 'required|file|mimes:pdf|max:5120',
        ]);

        $data['type_of_disaster'] = str($data['type_of_disaster'])->slug();

        if ($request->hasFile('pdf_file')) {
            $data['pdf_file'] = Storage::disk('public')->put('posts_request', $request->file('pdf_file'));
        }

        $request->user()->posts_request()->create($data);

        // ✅ Add the flash message for creation success
        return to_route('posts_request.index')->with('created', 'Post request created successfully!');
    }
}
