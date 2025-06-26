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
        Schema::create('pagos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nota_venta_id')->constrained('nota_venta')->onDelete('cascade');
            $table->foreignId('tipo_pago_id')->constrained('tipo_pago')->onDelete('cascade');
            $table->dateTime('fechapago');
            $table->enum('estado', ['pendiente', 'pagado', 'fallido', 'reembolsado'])->default('pendiente');
            $table->string('pago_facil_id')->nullable()->comment('ID de transacción de la pasarela de pago');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pagos');
    }
};
