<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\RoleEnum;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info('🌱 Iniciando la siembra de datos...');

        $this->call([
            // Sistema base
            SpatieRolePermissionSeeder::class, // Primero roles y permisos con Spatie
            CategoriaSeeder::class,
            
            // Usuarios y relaciones
            PqrsSeeder::class,
            AdministrativoSeeder::class,
            ClienteSeeder::class,
            
            // Productos y almacenes  
            ProductoSeeder::class,
            InventarioSeeder::class,
            
            // Transacciones
            ProveedorSeeder::class,
            NotaCompraSeeder::class,
            DetalleCompraSeeder::class,
            VentasSeeder::class,
            PromocionSeeder::class,
            
            // Ajustes y carritos
            AjusteInventarioSeeder::class,
            DetalleAjusteSeeder::class,
            CarritoSeeder::class,
            DetalleCarritoSeeder::class,
            
            // Datos específicos para home
            HomeDataSeeder::class,
        ]);
        
        $this->command->info('🎉 Siembra de datos completada exitosamente!');
    }

    /**
     * Crear usuario super administrador
     */
    private function createSuperAdmin(): void
    {
        // Crear el usuario super admin
        $superAdmin = User::firstOrCreate(
            ['email' => 'super@admin.com'],
            [
                'nombre' => 'Super Administrador',
                'celular' => '+1234567899',
                'genero' => 'otro',
                'password' => Hash::make('password'),
                'estado' => 'activo',
                'email_verified_at' => now(),
            ]
        );

        $this->command->info('✅ Usuario Super Administrador creado/verificado exitosamente');
        $this->command->info('   Email: super@admin.com');
        $this->command->info('   Password: password');
        $this->command->info('   Rol será asignado por RBACSystemSeeder');
    }
}
