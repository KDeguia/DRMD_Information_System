<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class RequestModel extends Model
{
    //
        use HasFactory;

    protected $table = 'tbl_requests';  // <- change this if needed

    protected $primaryKey = 'id';  // <- change if your PK is something else


    public $timestamps = true;

    // Add any fillable fields if you plan on mass assignment (optional for reads)
    protected $fillable = [
        'request_no',
        'user_id',
        'date_of_request',
        'type_of_disaster',
        'particular',
        'quantity',
        'recommended_quantity',
        'total_affected_families',
        'cost',
        'purpose',
        'mode_of_transportaion',
        'validated',
        'validated_by',
        'date_validated',
        'city_municipality',
        'province',
        'region',
        'barangay',
        'type_of_assistance',
        'purpose',
    ];
}
