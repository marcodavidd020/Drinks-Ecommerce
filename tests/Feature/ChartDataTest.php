<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Enums\PermissionEnum;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ChartDataTest extends TestCase
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

    public function test_chart_data_has_valid_structure_for_chartjs()
    {
        $user = $this->createUserWithDashboardAccess();

        $response = $this->actingAs($user)->get('/dashboard');

        // Verificar que la vista se carga correctamente con datos para Chart.js
        $response->assertStatus(200);
        $response->assertSee('window.dashboardMetricas');
        $response->assertSee('ventasPorMes');
        $response->assertSee('productosMasVendidos');
    }

    public function test_chart_data_can_be_processed_for_frontend()
    {
        $user = $this->createUserWithDashboardAccess();

        $response = $this->actingAs($user)->get('/dashboard');

        // Verificar que la vista se carga correctamente con datos procesados
        $response->assertStatus(200);
        $response->assertSee('dashboard-app-container');
        $response->assertSee('ventasPorMes');
        $response->assertSee('window.authUser');
    }
} 