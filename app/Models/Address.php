<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Address extends Model
{
    use HasFactory;

    // If your table name is NOT 'addresses', specify it
    protected $table = 'ph_address';  // <- change this if needed

    // If your primary key isn't 'id', specify it
    protected $primaryKey = 'id';  // <- change if your PK is something else

    // If you don't have timestamps (created_at / updated_at), disable them
    public $timestamps = true;

    // Add any fillable fields if you plan on mass assignment (optional for reads)
    protected $fillable = [
        'region',
        'province',
        'city',
        'barangay'
    ];

    // Example: Scope to filter cities by province (optional helper)
    public function scopeByProvince($query, $province)
    {
        return $query->where('province', $province);
    }
}
