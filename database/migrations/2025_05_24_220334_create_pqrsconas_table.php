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
        Schema::create('pqrsonas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('apellido');
            $table->string('telefono')->nullable();
            $table->string('direccion')->nullable();
            $table->string('email')->nullable();
            $table->enum('tipo', ['peticion', 'queja', 'reclamo', 'sugerencia']);
            $table->text('descripcion');
            $table->enum('estado', ['pendiente', 'en_proceso', 'resuelto', 'cerrado'])->default('pendiente');
            $table->date('fecha_creacion');
            $table->date('fecha_respuesta')->nullable();
            $table->text('respuesta')->nullable();
            $table->foreignId('administrativo_id')->nullable()->constrained('administrativos')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pqrsonas');
    }
};
