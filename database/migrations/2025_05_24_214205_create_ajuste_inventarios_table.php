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
        Schema::create('ajuste_inventarios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('administrativo_id')->constrained('administrativos')->onDelete('cascade');
            $table->date('fecha');
            $table->text('glosa')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ajuste_inventarios');
    }
};
