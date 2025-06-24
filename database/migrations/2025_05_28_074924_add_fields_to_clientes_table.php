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
        Schema::table('cliente', function (Blueprint $table) {
            $table->string('telefono', 20)->nullable()->after('nit');
            $table->date('fecha_nacimiento')->nullable()->after('telefono');
            $table->enum('genero', ['masculino', 'femenino', 'otro', 'prefiero_no_decir'])->nullable()->after('fecha_nacimiento');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cliente', function (Blueprint $table) {
            $table->dropColumn(['telefono', 'fecha_nacimiento', 'genero']);
        });
    }
};
