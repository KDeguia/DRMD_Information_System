<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tbl_requests', function (Blueprint $table) {
            $table->id();
            $table->string('request_no')->unique();
            $table->string('user_id');
            $table->date('date_of_request');
            $table->string('type_of_assistance');
            $table->string('type_of_disaster');
            $table->string('particular');
            $table->integer('quantity');
            $table->integer('recommended_quntity');
            $table->integer('total_affected_families');
            $table->double('cost');
            $table->longText('purpose');
            $table->string('mode_of_transporation');
            $table->string('validated');
            $table->string('validated_by');
            $table->string('date_validated');
            $table->string('city_municipality');
            $table->string('province');
            // $table->string('region');
            // $table->string('request_to');
            $table->string('remarks');
            $table->integer('request_status');
            $table->integer('received');
            $table->date('date_received');
            $table->string('requested_by');
            $table->date('date_requested');
            $table->string('approved_by');
            $table->date('date_approved');
            $table->string('released_by');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_requests');
    }
};
