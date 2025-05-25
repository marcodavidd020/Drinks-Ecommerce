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
        
        // Ejecutar seeders para tener datos de prueba
        $this->artisan('db:seed', ['--class' => 'ProductoSeeder']);
        $this->artisan('db:seed', ['--class' => 'NotaVentaSeeder']);
        $this->artisan('db:seed', ['--class' => 'DetalleVentaSeeder']);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertInertia(fn ($page) => 
            $page->where('ventasPorMes', function ($ventasPorMes) {
                // Convertir a array si es collection
                $ventasArray = $ventasPorMes instanceof \Illuminate\Support\Collection ? $ventasPorMes->toArray() : $ventasPorMes;
                
                // Verificar que hay datos
                $this->assertGreaterThan(0, count($ventasArray), 'Debe haber datos de ventas por mes');
                
                // Verificar estructura para Chart.js
                foreach ($ventasArray as $venta) {
                    $this->assertIsNumeric($venta['mes'], 'El mes debe ser numérico');
                    $this->assertIsNumeric($venta['año'], 'El año debe ser numérico');
                    $this->assertIsNumeric($venta['total'], 'El total debe ser numérico');
                    $this->assertIsNumeric($venta['cantidad'], 'La cantidad debe ser numérica');
                    
                    // Verificar rangos válidos
                    $this->assertGreaterThanOrEqual(1, $venta['mes']);
                    $this->assertLessThanOrEqual(12, $venta['mes']);
                    $this->assertGreaterThan(2020, $venta['año']);
                    $this->assertGreaterThan(0, $venta['total']);
                    $this->assertGreaterThan(0, $venta['cantidad']);
                }
                
                return true;
            })
            ->where('productosMasVendidos', function ($productos) {
                // Convertir a array si es collection
                $productosArray = $productos instanceof \Illuminate\Support\Collection ? $productos->toArray() : $productos;
                
                // Verificar que hay datos
                $this->assertGreaterThan(0, count($productosArray), 'Debe haber productos más vendidos');
                
                // Verificar estructura para Chart.js
                foreach ($productosArray as $producto) {
                    $this->assertIsNumeric($producto['id'], 'El ID debe ser numérico');
                    $this->assertIsString($producto['nombre'], 'El nombre debe ser string');
                    $this->assertIsNumeric($producto['total_vendido'], 'El total vendido debe ser numérico');
                    
                    // Verificar valores válidos
                    $this->assertGreaterThan(0, $producto['id']);
                    $this->assertNotEmpty($producto['nombre']);
                    $this->assertGreaterThan(0, $producto['total_vendido']);
                }
                
                return true;
            })
        );
    }

    public function test_chart_data_can_be_processed_for_frontend()
    {
        $user = $this->createUserWithDashboardAccess();
        
        // Ejecutar seeders para tener datos de prueba
        $this->artisan('db:seed', ['--class' => 'ProductoSeeder']);
        $this->artisan('db:seed', ['--class' => 'NotaVentaSeeder']);
        $this->artisan('db:seed', ['--class' => 'DetalleVentaSeeder']);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertInertia(fn ($page) => 
            $page->where('ventasPorMes', function ($ventasPorMes) {
                // Convertir a array si es collection
                $ventasArray = $ventasPorMes instanceof \Illuminate\Support\Collection ? $ventasPorMes->toArray() : $ventasPorMes;
                
                // Simular procesamiento para Chart.js
                $labels = array_map(function($item) {
                    return $item['mes'] . '/' . $item['año'];
                }, $ventasArray);
                
                $data = array_map(function($item) {
                    return $item['total'];
                }, $ventasArray);
                
                // Verificar que se pueden crear labels y data válidos
                $this->assertIsArray($labels);
                $this->assertIsArray($data);
                $this->assertEquals(count($ventasArray), count($labels));
                $this->assertEquals(count($ventasArray), count($data));
                
                // Verificar que todos los labels son strings válidos
                foreach ($labels as $label) {
                    $this->assertIsString($label);
                    $this->assertMatchesRegularExpression('/^\d{1,2}\/\d{4}$/', $label);
                }
                
                // Verificar que todos los datos son numéricos
                foreach ($data as $value) {
                    $this->assertIsNumeric($value);
                    $this->assertGreaterThan(0, $value);
                }
                
                return true;
            })
            ->where('productosMasVendidos', function ($productos) {
                // Convertir a array si es collection
                $productosArray = $productos instanceof \Illuminate\Support\Collection ? $productos->toArray() : $productos;
                
                // Tomar solo los primeros 5 para el gráfico
                $top5 = array_slice($productosArray, 0, 5);
                
                // Simular procesamiento para Chart.js
                $labels = array_map(function($item) {
                    return $item['nombre'];
                }, $top5);
                
                $data = array_map(function($item) {
                    return $item['total_vendido'];
                }, $top5);
                
                // Verificar que se pueden crear labels y data válidos
                $this->assertIsArray($labels);
                $this->assertIsArray($data);
                $this->assertEquals(count($top5), count($labels));
                $this->assertEquals(count($top5), count($data));
                $this->assertLessThanOrEqual(5, count($labels));
                
                // Verificar que todos los labels son strings válidos
                foreach ($labels as $label) {
                    $this->assertIsString($label);
                    $this->assertNotEmpty($label);
                }
                
                // Verificar que todos los datos son numéricos
                foreach ($data as $value) {
                    $this->assertIsNumeric($value);
                    $this->assertGreaterThan(0, $value);
                }
                
                return true;
            })
        );
    }
} 