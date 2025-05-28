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
        Schema::table('direcciones', function (Blueprint $table) {
            // Agregar columnas para relaciones polimórficas
            $table->unsignedBigInteger('cliente_id')->nullable()->after('id');
            $table->unsignedBigInteger('proveedor_id')->nullable()->after('cliente_id');
            
            // Agregar campos faltantes para direcciones completas (nullable por datos existentes)
            $table->string('tipo_direccion', 50)->nullable()->after('nombre');
            $table->string('direccion')->nullable()->after('tipo_direccion');
            $table->string('ciudad', 100)->nullable()->after('direccion');
            $table->string('departamento', 100)->nullable()->after('ciudad');
            $table->string('codigo_postal', 10)->nullable()->after('departamento');
            
            // Agregar índices y llaves foráneas
            $table->foreign('cliente_id')->references('id')->on('clientes')->onDelete('cascade');
            $table->foreign('proveedor_id')->references('id')->on('proveedores')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('direcciones', function (Blueprint $table) {
            $table->dropForeign(['cliente_id']);
            $table->dropForeign(['proveedor_id']);
            $table->dropColumn([
                'cliente_id',
                'proveedor_id',
                'tipo_direccion',
                'direccion',
                'ciudad',
                'departamento',
                'codigo_postal'
            ]);
        });
    }
};
