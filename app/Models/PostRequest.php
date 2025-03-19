<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostRequest extends Model
{
    protected $fillable = [
        'request_no',
        'user_id',
        'date_of_request',
        'type_of_disaster',
        'total_affected_families',
        'purpose',
        'mode_of_transportation',
        'validated_by',
        'validated',
        'date_validated',
        'city_municipality',
        'province',
        'pdf_file',
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

    public function assistances()
    {
        return $this->hasMany(Assistance::class);
    }
}
