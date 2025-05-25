<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Primero crear roles y permisos
        $this->call([
            RoleAndPermissionSeeder::class,
        ]);

        // Crear usuario super administrador
        User::factory()->create([
            'nombre' => 'Super Administrador',
            'email' => 'super@admin.com',
            'estado' => 'activo',
        ])->assignRole('super-admin');

        // Ejecutar seeders específicos para tienda de bebidas
        $this->call([
            ClienteSeeder::class,
            AdministrativoSeeder::class,
            PqrsonaSeeder::class,
            PempresaSeeder::class,
            ProveedorSeeder::class,
            InventarioSeeder::class,
            ProductoSeeder::class,
            NotaVentaSeeder::class,
            DetalleVentaSeeder::class,
        ]);
    }
}
