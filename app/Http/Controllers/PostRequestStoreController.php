<?php

namespace App\Http\Controllers;

use App\Models\PostRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PostRequestStoreController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        // ✅ Validate request data
        $validated = $request->validate([
            'type_of_disaster' => 'required|string|max:255',
            'purpose' => 'required|string|max:255',
            'pdf_file' => 'nullable|file|mimes:pdf|max:5120',
            'date_of_request' => 'required|string|max:255',
            'province' => 'required|string|max:255',
            'city_municipality' => 'required|string|max:255',
            'assistance' => 'required|array|min:1',
            'assistance.*.type_of_assistance' => 'required|string|max:255',
            'assistance.*.particular' => 'required|string|max:255',
            'assistance.*.quantity' => 'required|integer|min:1',
            'mode_of_transportation' => 'required|string|max:255',
        ]);

        // ✅ Modify fields as needed
        $validated['type_of_disaster'] = str($validated['type_of_disaster'])->slug();

        DB::transaction(function () use ($request, $validated) {

            // ✅ Store the PDF if uploaded
            if ($request->hasFile('pdf_file')) {
                $validated['pdf_file'] = Storage::disk('public')->put('posts_request', $request->file('pdf_file'));
            }

            // ✅ Create the main post request (excluding 'assistance')
            $postRequest = $request->user()->posts_request()->create([
                'type_of_disaster'       => $validated['type_of_disaster'],
                'purpose'                => $validated['purpose'],
                'pdf_file'               => $validated['pdf_file'] ?? null,
                'date_of_request'        => $validated['date_of_request'],
                'province'               => $validated['province'],
                'city_municipality'      => $validated['city_municipality'],
                'mode_of_transportation' => $validated['mode_of_transportation'],
                // ✅ Add any other fields that you need here
            ]);

            // ✅ Save each assistance item
            foreach ($validated['assistance'] as $item) {
                $postRequest->assistances()->create([
                    'type_of_assistance' => $item['type_of_assistance'],
                    'particular'         => $item['particular'],
                    'quantity'           => $item['quantity'],
                ]);
            }
        });

        // ✅ Redirect with a flash message
        return to_route('posts_request.index')->with('created', 'New request created successfully!');
    }
}
