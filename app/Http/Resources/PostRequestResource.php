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
            'date_of_request' => $this->date_of_request,
            'type_of_disaster' => $this->type_of_disaster,
            'purpose' => $this->purpose,
            'pdf_file' => asset('storage/' . $this->pdf_file),
            'province' => $this->province,
            'city_municipality' => $this->city_municipality,
        ];
    }
}
