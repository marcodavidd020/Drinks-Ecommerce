<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;

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
            RoleAndPermissionSeeder::class,
        ]);

        // 2. Seeders de entidades base
        $this->call([
            PempresaSeeder::class,
        ]);

        // 3. Seeders de productos y proveedores
        $this->call([
            ProveedorSeeder::class,
            ProductoSeeder::class,
            InventarioSeeder::class,
        ]);

        // 4. Seeders de clientes
        $this->call([
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
        $this->command->info('   • Clientes y proveedores (personas y empresas)');
        $this->command->info('   • Ventas históricas con detalles (6 meses)');
        $this->command->info('   • Notas de compra con detalles (4 meses)');
        $this->command->info('   • PQRS de ejemplo (3 meses)');
        $this->command->info('   • Carritos con detalles de productos (30 días)');
        $this->command->info('   • Ajustes de inventario con detalles');
        $this->command->info('   • Datos específicos para home y tienda');
    }
}
