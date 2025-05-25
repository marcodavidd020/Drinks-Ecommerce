<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Models\DetalleVenta;
use App\Models\NotaVenta;
use App\Models\Producto;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotaVentaTest extends TestCase
{
    use RefreshDatabase;

    public function test_puede_crear_nota_venta(): void
    {
        $notaVenta = NotaVenta::create([
            'fecha' => now()->toDateString(),
            'total' => 250.75,
            'estado' => 'pendiente',
        ]);

        $this->assertInstanceOf(NotaVenta::class, $notaVenta);
        $this->assertEquals('pendiente', $notaVenta->estado);
        $this->assertEquals(250.75, $notaVenta->total);
    }

    public function test_nota_venta_tiene_muchos_detalles(): void
    {
        $notaVenta = NotaVenta::create([
            'fecha' => now()->toDateString(),
            'total' => 0,
            'estado' => 'pendiente',
        ]);

        $producto1 = Producto::factory()->create(['precio_venta' => 25.50]);
        $producto2 = Producto::factory()->create(['precio_venta' => 15.75]);

        $detalle1 = DetalleVenta::create([
            'nota_venta_id' => $notaVenta->id,
            'producto_id' => $producto1->id,
            'cantidad' => 2,
            'precio_unitario' => 25.50,
            'total' => 51.00,
        ]);

        $detalle2 = DetalleVenta::create([
            'nota_venta_id' => $notaVenta->id,
            'producto_id' => $producto2->id,
            'cantidad' => 3,
            'precio_unitario' => 15.75,
            'total' => 47.25,
        ]);

        $this->assertCount(2, $notaVenta->detalles);
        $this->assertTrue($notaVenta->detalles->contains($detalle1));
        $this->assertTrue($notaVenta->detalles->contains($detalle2));
    }

    public function test_puede_calcular_total_venta(): void
    {
        $notaVenta = NotaVenta::create([
            'fecha' => now()->toDateString(),
            'total' => 0,
            'estado' => 'pendiente',
        ]);

        $producto1 = Producto::factory()->create();
        $producto2 = Producto::factory()->create();

        DetalleVenta::create([
            'nota_venta_id' => $notaVenta->id,
            'producto_id' => $producto1->id,
            'cantidad' => 2,
            'precio_unitario' => 20.00,
            'total' => 40.00,
        ]);

        DetalleVenta::create([
            'nota_venta_id' => $notaVenta->id,
            'producto_id' => $producto2->id,
            'cantidad' => 1,
            'precio_unitario' => 35.50,
            'total' => 35.50,
        ]);

        $this->assertEquals(75.50, $notaVenta->calcularTotal());
    }

    public function test_puede_verificar_si_esta_completada(): void
    {
        $notaCompletada = NotaVenta::create([
            'fecha' => now()->toDateString(),
            'total' => 100.00,
            'estado' => 'completada',
        ]);

        $notaPendiente = NotaVenta::create([
            'fecha' => now()->toDateString(),
            'total' => 50.00,
            'estado' => 'pendiente',
        ]);

        $this->assertTrue($notaCompletada->estaCompletada());
        $this->assertFalse($notaPendiente->estaCompletada());
    }

    public function test_puede_obtener_total_productos(): void
    {
        $notaVenta = NotaVenta::create([
            'fecha' => now()->toDateString(),
            'total' => 0,
            'estado' => 'pendiente',
        ]);

        $producto1 = Producto::factory()->create();
        $producto2 = Producto::factory()->create();

        DetalleVenta::create([
            'nota_venta_id' => $notaVenta->id,
            'producto_id' => $producto1->id,
            'cantidad' => 5,
            'precio_unitario' => 10.00,
            'total' => 50.00,
        ]);

        DetalleVenta::create([
            'nota_venta_id' => $notaVenta->id,
            'producto_id' => $producto2->id,
            'cantidad' => 3,
            'precio_unitario' => 15.00,
            'total' => 45.00,
        ]);

        $this->assertEquals(8, $notaVenta->total_productos);
    }

    public function test_puede_completar_venta(): void
    {
        $notaVenta = NotaVenta::create([
            'fecha' => now()->toDateString(),
            'total' => 0,
            'estado' => 'pendiente',
        ]);

        $producto = Producto::factory()->create();

        DetalleVenta::create([
            'nota_venta_id' => $notaVenta->id,
            'producto_id' => $producto->id,
            'cantidad' => 2,
            'precio_unitario' => 25.00,
            'total' => 50.00,
        ]);

        $notaVenta->completar();

        $notaVenta->refresh();
        $this->assertEquals('completada', $notaVenta->estado);
        $this->assertEquals(50.00, $notaVenta->total);
    }

    public function test_campos_fillable_correctos(): void
    {
        $fillable = ['fecha', 'total', 'estado'];
        $notaVenta = new NotaVenta();

        $this->assertEquals($fillable, $notaVenta->getFillable());
    }

    public function test_casts_correctos(): void
    {
        $notaVenta = new NotaVenta();
        $casts = $notaVenta->getCasts();

        $this->assertEquals('date', $casts['fecha']);
        $this->assertEquals('decimal:2', $casts['total']);
    }
}
