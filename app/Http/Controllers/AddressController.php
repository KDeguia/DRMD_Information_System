<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AddressController extends Controller
{
    // Get provinces by region
    public function getProvinces(Request $request)
    {
        $region = $request->query('region', 'Region III (Central Luzon)');

        $provinces = DB::table('ph_address')
            ->select('province')
            ->where('region', $region)
            ->whereNotNull('province')
            ->distinct()
            ->orderBy('province')
            ->get();

        return response()->json($provinces);
    }

    // Get municipalities by province
    public function getMunicipalities(Request $request, $province)
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

    // Get barangays by municipality
    public function getBarangays(Request $request, $municipality)
    {
        $barangays = DB::table('ph_address')
            ->select('barangay')
            ->where('municipality', $municipality)
            ->whereNotNull('barangay')
            ->distinct()
            ->orderBy('barangay')
            ->get();

        return response()->json($barangays);
    }
}
