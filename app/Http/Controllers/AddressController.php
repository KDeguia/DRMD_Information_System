<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AddressController extends Controller
{
    // Get unique provinces
    // Get unique provinces
    public function getProvinces()
    {
        $provinces = DB::table('ph_address')
            ->select('province')
            ->whereNotNull('province')
            ->distinct()
            ->orderBy('province')
            ->get();

        return response()->json($provinces);
    }

    // Get unique municipalities based on selected province
    public function getMunicipalities($province)
    {
        $municipalities = DB::table('ph_address')
            ->select('municipality')
            ->where('province', $province)
            ->whereNotNull('municipality')
            ->distinct()
            ->orderBy('municipality')
            ->get();

        return response()->json($municipalities);
    }

    // Get unique barangays based on selected province and municipality
    public function getBarangays($province, $municipality)
    {
        $barangays = DB::table('ph_address')
            ->select('barangay')
            ->where('province', $province)
            ->where('municipality', $municipality)
            ->whereNotNull('barangay')
            ->distinct()
            ->orderBy('barangay')
            ->get();

        return response()->json($barangays);
    }
}
