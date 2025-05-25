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
        Schema::create('pempresas', function (Blueprint $table) {
            $table->id();
            $table->string('razon_social');
            $table->string('nit')->unique();
            $table->string('telefono')->nullable();
            $table->string('direccion')->nullable();
            $table->string('email')->unique()->nullable();
            $table->string('representante_legal')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pempresas');
    }
};
