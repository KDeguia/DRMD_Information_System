<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostRequest extends Model
{
     protected $fillable = [

            'request_no',
            'user_id',
            'date_of_request',
            'type_of_assistance',
            'type_of_disaster',
            'quantity',
            'particular',
            'recommended_quntity',
            'total_affected_families',
            'purpose',
            'mode_of_transporation',
            'validated_by',
            'validated',
            'date_validated',
            'city_municipality',
            'province',
            'pdf_file',
            // 'region',
            // 'request_to',
            'remarks',
            'request_status',
            'received',
            'date_received',
            'requested_by',
            'date_requested',
            'approved_by',
            'date_approved',
            'released_by',

     ];

     public function user()
     {
        return $this->belongsTo(User::class);

     }
}
