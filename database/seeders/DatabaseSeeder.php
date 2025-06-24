<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\RoleEnum;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info('🌱 Iniciando la siembra de datos...');

        // 1. Seeders de configuración base
        $this->call([
            RolSeeder::class,
            PermisoSeeder::class,
            RolPermisoSeeder::class,
            UserRolSeeder::class,
        ]);

        // Crear usuario super admin
        $this->createSuperAdmin();

        // 2. Seeders de entidades base
        $this->call([
            PempresaSeeder::class,
        ]);

        // 3. Seeders de productos y proveedores
        $this->call([
            ProveedorSeeder::class,
            ProductoSeeder::class,
            InventarioSeeder::class,
            PromocionSeeder::class,
        ]);

        // 4. Seeders de clientes y administrativos
        $this->call([
            AdministrativoSeeder::class,
            ClienteSeeder::class,
        ]);

        // 5. Seeders de operaciones y transacciones
        $this->call([
            VentasSeeder::class,
            NotaCompraSeeder::class,
            AjusteInventarioSeeder::class,
            PqrsSeeder::class,
            CarritoSeeder::class,
        ]);

        // 6. Seeders de detalles (después de las operaciones principales)
        $this->call([
            DetalleCompraSeeder::class,
            DetalleCarritoSeeder::class,
            DetalleAjusteSeeder::class,
        ]);

        // 7. Seeders específicos para datos de demostración
        $this->call([
            HomeDataSeeder::class,
            TiendaBebidasSeeder::class,
        ]);

        $this->command->info('✅ ¡Siembra de datos completada exitosamente!');
        $this->command->info('📊 Datos disponibles para pruebas:');
        $this->command->info('   • Usuarios y roles configurados');
        $this->command->info('   • Productos con inventarios');
        $this->command->info('   • Promociones con descuentos (activas, pendientes, vencidas)');
        $this->command->info('   • Clientes y proveedores (personas y empresas)');
        $this->command->info('   • Ventas y notas de venta con detalles (6 meses)');
        $this->command->info('   • Notas de compra con detalles (4 meses)');
        $this->command->info('   • PQRS de ejemplo (3 meses)');
        $this->command->info('   • Carritos con detalles de productos (30 días)');
        $this->command->info('   • Ajustes de inventario con detalles');
        $this->command->info('   • Datos específicos para home y tienda');
    }

    /**
     * Crear usuario super administrador
     */
    private function createSuperAdmin(): void
    {
        // Verificar si el usuario ya existe
        if (DB::table('user')->where('email', 'super@admin.com')->exists()) {
            return;
        }

        // Crear el usuario super admin directamente en la tabla
        $superAdminId = DB::table('user')->insertGetId([
            'nombre' => 'Super Administrador',
            'email' => 'super@admin.com',
            'celular' => '+1234567899',
            'genero' => 'otro',
            'password' => bcrypt('password'),
            'estado' => 'activo',
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Asignar rol de admin usando nuestro sistema de user_rol
        $adminRole = DB::table('rol')->where('nombre', 'admin')->first();
        if ($adminRole && $superAdminId) {
            DB::table('user_rol')->insert([
                'user_id' => $superAdminId,
                'rol_id' => $adminRole->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $this->command->info('✅ Usuario Super Administrador creado exitosamente');
        $this->command->info('   Email: super@admin.com');
        $this->command->info('   Password: password');
    }
}
