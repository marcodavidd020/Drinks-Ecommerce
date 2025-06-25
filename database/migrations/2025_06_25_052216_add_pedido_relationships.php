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
        // Agregar pedido_id a la tabla carrito (relación 1:1 con pedido)
        Schema::table('carrito', function (Blueprint $table) {
            $table->foreignId('pedido_id')->nullable()->constrained('pedido')->onDelete('set null');
        });

        // Agregar pedido_id a la tabla nota_venta (relación 1:1 con pedido)
        Schema::table('nota_venta', function (Blueprint $table) {
            $table->foreignId('pedido_id')->nullable()->constrained('pedido')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('carrito', function (Blueprint $table) {
            $table->dropForeign(['pedido_id']);
            $table->dropColumn('pedido_id');
        });

        Schema::table('nota_venta', function (Blueprint $table) {
            $table->dropForeign(['pedido_id']);
            $table->dropColumn('pedido_id');
        });
    }
};
