<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Assistance extends Model
{
    protected $fillable = [
        'post_request_id',
        'type_of_assistance',
        'particular',
        'quantity',
    ];

    public function postRequest()
    {
        return $this->belongsTo(PostRequest::class);
    }
}
