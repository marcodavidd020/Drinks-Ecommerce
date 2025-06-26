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
        Schema::create('proveedor', function (Blueprint $table) {
            $table->id();
            $table->enum('tipo', ['persona', 'empresa']);
            
            // Campos para persona
            $table->string('nombre')->nullable(); // Nombre de la persona
            $table->string('apellido')->nullable();

            // Campos para empresa
            $table->string('razon_social')->nullable();

            // Campos comunes
            $table->string('telefono')->nullable();
            $table->string('email')->nullable()->unique();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proveedor');
    }
};
