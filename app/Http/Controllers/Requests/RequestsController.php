<?php

namespace App\Http\Controllers\Requests;

use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;

class RequestsController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index(): Response
    {
        return Inertia::render('requests/new_request', [
            // Fetch all posts (no user relation)
            'new_request' => Post::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title'   => 'required|string|max:255',
            'content' => 'required|string',
            'picture' => 'nullable|image|max:2048', // Validate that picture is an image
        ]);

        $data = $request->only(['title', 'content']);

        if ($request->hasFile('picture')) {
            $file = $request->file('picture');
            $filename = time() . '_' . $file->getClientOriginalName();
            // Store the file in the "public/uploads" directory
            $path = $file->storeAs('uploads', $filename, 'public');
            $data['picture'] = '/storage/' . $path;
        }

        Post::create($data);

        return redirect()->route('posts.index')->with('success', 'Request created successfully.');
    }

    public function update(Request $request, Post $new_request)
    {
        $request->validate([
            'title'   => 'required|string|max:255',
            'content' => 'required|string',
            'picture' => 'nullable|image|max:2048',
        ]);

        $data = $request->only(['title', 'content']);

        if ($request->hasFile('picture')) {
            $file = $request->file('picture');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('uploads', $filename, 'public');
            $data['picture'] = '/storage/' . $path;
        }

        $new_request->update($data);

        return redirect()->route('posts.index')->with('success', 'Request updated successfully.');
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $new_request)
    {
        $new_request->delete();

        return redirect()->route('posts.index')->with('success', 'Request deleted successfully.');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */


    /**
     * Remove the specified resource from storage.
     */

}
