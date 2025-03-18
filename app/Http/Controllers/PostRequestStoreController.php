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
            'type_of_disaster' => 'required|string|max:255',
            'purpose' => 'required|string|max:255',
            'pdf_file' => 'required|nullable|file|mimes:pdf|max:5120',
            'date_of_request' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'city_municipality' => 'required|string|max:255'

        ]);

        $data['type_of_disaster'] = str($data['type_of_disaster'])->slug();

        if ($request->hasFile('pdf_file')) {
            $data['pdf_file'] = Storage::disk('public')->put('posts_request', $request->file('pdf_file'));
        }

        $request->user()->posts_request()->create($data);

        // ✅ Add the flash message for creation success
        return to_route('posts_request.index')->with('created', 'New request created successfully!');
    }
}
