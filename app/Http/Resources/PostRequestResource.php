<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostRequestResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [

            'id' => $this->id,
            'type_of_disaster' => $this->type_of_disaster,
            'purpose' => $this->purpose,
            'pdf_file' => asset('storage/' . $this->pdf_file),
        ];
    }
}
