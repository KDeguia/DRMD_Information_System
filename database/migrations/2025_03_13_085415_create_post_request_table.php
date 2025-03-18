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
        Schema::create('post_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('request_no')->unique()->nullable();
            $table->string('date_of_request')->nullable();
            $table->string('type_of_assistance')->nullable();
            $table->string('type_of_disaster')->nullable();
            $table->integer('quantity')->nullable();
            $table->string('particular')->nullable();
            $table->integer('recommended_quntity')->nullable();
            $table->integer('total_affected_families')->nullable();
            $table->longText('purpose')->nullable();
            $table->string('mode_of_transporation')->nullable();
            $table->string('validated_by')->nullable();
            $table->string('validated')->nullable();
            $table->string('date_validated')->nullable();
            $table->string('city_municipality')->nullable();
            $table->string('province')->nullable();
            $table->string('pdf_file')->nullable();
            // $table->string('region');
            // $table->string('request_to');
            $table->string('remarks')->nullable();
            $table->integer('request_status')->nullable();
            $table->integer('received')->nullable();
            $table->date('date_received')->nullable();
            $table->string('requested_by')->nullable();
            $table->date('date_requested')->nullable();
            $table->string('approved_by')->nullable();
            $table->date('date_approved')->nullable();
            $table->string('released_by')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('post_requests');
    }
};
