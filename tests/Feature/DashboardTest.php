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

        // Hacer login
        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);

        // Verificar que la vista contiene los elementos necesarios para React
        $response->assertSee('dashboard-app-container');
        $response->assertSee('window.authUser');
        $response->assertSee('window.dashboardMetricas');
        $response->assertSee('totalVentas');
    }

    public function test_ventas_por_mes_data_format()
    {
        $user = $this->createUserWithDashboardAccess();
        
        $response = $this->actingAs($user)->get('/dashboard');

        // Verificar que la vista se carga correctamente
        $response->assertStatus(200);
        
        // Verificar que los datos de ventas por mes están disponibles
        $response->assertSee('ventasPorMes');
        $response->assertSee('año');
        $response->assertSee('mes');
        $response->assertSee('total');
    }

    public function test_productos_mas_vendidos_data_format()
    {
        $user = $this->createUserWithDashboardAccess();
        
        $response = $this->actingAs($user)->get('/dashboard');

        // Verificar que la vista se carga correctamente
        $response->assertStatus(200);
        
        // Verificar que los datos de productos más vendidos están disponibles
        $response->assertSee('productosMasVendidos');
        $response->assertSee('nombre');
        $response->assertSee('total_vendido');
    }
}
