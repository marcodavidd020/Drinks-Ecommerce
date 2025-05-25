<?php

namespace Tests\Feature;

use App\Models\User;
use App\Enums\PermissionEnum;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    protected function createUserWithDashboardAccess(): User
    {
        $user = User::factory()->create();
        
        // Crear y asignar el permiso necesario
        $permission = Permission::firstOrCreate(['name' => PermissionEnum::ACCESO_DASHBOARD->value]);
        $user->givePermissionTo($permission);
        
        return $user;
    }

    public function test_guests_are_redirected_to_the_login_page()
    {
        $response = $this->get('/dashboard');
        $response->assertRedirect('/login');
    }

    public function test_authenticated_users_can_visit_the_dashboard()
    {
        $user = $this->createUserWithDashboardAccess();
        $this->actingAs($user);

        $response = $this->get('/dashboard');
        $response->assertStatus(200);
    }

    public function test_dashboard_returns_correct_data_structure()
    {
        // Crear un usuario para autenticación
        $user = $this->createUserWithDashboardAccess();

        // Ejecutar seeders para tener datos de prueba
        $this->artisan('db:seed', ['--class' => 'ProductoSeeder']);
        $this->artisan('db:seed', ['--class' => 'NotaVentaSeeder']);
        $this->artisan('db:seed', ['--class' => 'DetalleVentaSeeder']);

        // Hacer login
        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);

        // Verificar que los datos necesarios están presentes
        $response->assertInertia(fn ($page) => 
            $page->has('totalVentas')
                 ->has('totalClientes')
                 ->has('totalProductos')
                 ->has('totalProveedores')
                 ->has('ventasEsteMes')
                 ->has('clientesEsteMes')
                 ->has('pqrsPendientes')
                 ->has('carritosAbandonados')
                 ->has('productosStockBajo')
                 ->has('ventasPorMes')
                 ->has('productosMasVendidos')
                 ->has('ventasRecientes')
                 ->has('pqrsRecientes')
                 ->has('stockCritico')
        );
    }

    public function test_ventas_por_mes_data_format()
    {
        $user = $this->createUserWithDashboardAccess();
        
        $this->artisan('db:seed', ['--class' => 'ProductoSeeder']);
        $this->artisan('db:seed', ['--class' => 'NotaVentaSeeder']);
        $this->artisan('db:seed', ['--class' => 'DetalleVentaSeeder']);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertInertia(fn ($page) => 
            $page->where('ventasPorMes', function ($ventasPorMes) {
                // Verificar que es un array o collection
                $this->assertTrue(is_array($ventasPorMes) || $ventasPorMes instanceof \Illuminate\Support\Collection);
                
                // Convertir a array si es collection
                $ventasArray = $ventasPorMes instanceof \Illuminate\Support\Collection ? $ventasPorMes->toArray() : $ventasPorMes;
                
                if (count($ventasArray) > 0) {
                    // Verificar estructura del primer elemento
                    $this->assertArrayHasKey('mes', $ventasArray[0]);
                    $this->assertArrayHasKey('año', $ventasArray[0]);
                    $this->assertArrayHasKey('total', $ventasArray[0]);
                    $this->assertArrayHasKey('cantidad', $ventasArray[0]);
                }
                
                return true;
            })
        );
    }

    public function test_productos_mas_vendidos_data_format()
    {
        $user = $this->createUserWithDashboardAccess();
        
        $this->artisan('db:seed', ['--class' => 'ProductoSeeder']);
        $this->artisan('db:seed', ['--class' => 'NotaVentaSeeder']);
        $this->artisan('db:seed', ['--class' => 'DetalleVentaSeeder']);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertInertia(fn ($page) => 
            $page->where('productosMasVendidos', function ($productos) {
                // Verificar que es un array o collection
                $this->assertTrue(is_array($productos) || $productos instanceof \Illuminate\Support\Collection);
                
                // Convertir a array si es collection
                $productosArray = $productos instanceof \Illuminate\Support\Collection ? $productos->toArray() : $productos;
                
                if (count($productosArray) > 0) {
                    // Verificar estructura del primer elemento
                    $this->assertArrayHasKey('id', $productosArray[0]);
                    $this->assertArrayHasKey('nombre', $productosArray[0]);
                    $this->assertArrayHasKey('total_vendido', $productosArray[0]);
                }
                
                return true;
            })
        );
    }
}
