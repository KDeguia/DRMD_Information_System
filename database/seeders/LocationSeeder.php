<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
          // Path to the SQL file
          $filePath = storage_path('ph_address.sql');

          // Read the SQL file
          $sql = file_get_contents($filePath);

          // Execute the SQL commands
          DB::unprepared($sql);
    }
}
