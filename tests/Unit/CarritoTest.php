<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Models\Carrito;
use App\Models\Cliente;
use App\Models\DetalleCarrito;
use App\Models\Producto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CarritoTest extends TestCase
{
    use RefreshDatabase;

    public function test_puede_crear_carrito(): void
    {
        $user = User::factory()->create();
        $cliente = Cliente::factory()->create(['user_id' => $user->id]);

        $carrito = Carrito::create([
            'cliente_id' => $cliente->id,
            'fecha' => now()->toDateString(),
            'total' => 0,
            'estado' => 'activo',
        ]);

        $this->assertInstanceOf(Carrito::class, $carrito);
        $this->assertEquals($cliente->id, $carrito->cliente_id);
        $this->assertEquals('activo', $carrito->estado);
    }

    public function test_carrito_pertenece_a_cliente(): void
    {
        $user = User::factory()->create();
        $cliente = Cliente::factory()->create(['user_id' => $user->id]);
        $carrito = Carrito::factory()->create(['cliente_id' => $cliente->id]);

        $this->assertInstanceOf(Cliente::class, $carrito->cliente);
        $this->assertEquals($cliente->id, $carrito->cliente->id);
    }

    public function test_carrito_tiene_muchos_detalles(): void
    {
        $user = User::factory()->create();
        $cliente = Cliente::factory()->create(['user_id' => $user->id]);
        $carrito = Carrito::factory()->create(['cliente_id' => $cliente->id]);
        $producto = Producto::factory()->create();

        $detalle = DetalleCarrito::create([
            'carrito_id' => $carrito->id,
            'producto_id' => $producto->id,
            'cantidad' => 2,
            'precio_unitario' => 10.50,
            'subtotal' => 21.00,
        ]);

        $this->assertTrue($carrito->detalles->contains($detalle));
        $this->assertCount(1, $carrito->detalles);
    }

    public function test_puede_calcular_total_carrito(): void
    {
        $user = User::factory()->create();
        $cliente = Cliente::factory()->create(['user_id' => $user->id]);
        $carrito = Carrito::factory()->create(['cliente_id' => $cliente->id]);
        $producto1 = Producto::factory()->create();
        $producto2 = Producto::factory()->create();

        DetalleCarrito::create([
            'carrito_id' => $carrito->id,
            'producto_id' => $producto1->id,
            'cantidad' => 2,
            'precio_unitario' => 10.50,
            'subtotal' => 21.00,
        ]);

        DetalleCarrito::create([
            'carrito_id' => $carrito->id,
            'producto_id' => $producto2->id,
            'cantidad' => 1,
            'precio_unitario' => 15.75,
            'subtotal' => 15.75,
        ]);

        $this->assertEquals(36.75, $carrito->calcularTotal());
    }

    public function test_puede_verificar_si_carrito_esta_activo(): void
    {
        $user = User::factory()->create();
        $cliente = Cliente::factory()->create(['user_id' => $user->id]);
        
        $carritoActivo = Carrito::factory()->create([
            'cliente_id' => $cliente->id,
            'estado' => 'activo'
        ]);
        
        $carritoProcesado = Carrito::factory()->create([
            'cliente_id' => $cliente->id,
            'estado' => 'procesado'
        ]);

        $this->assertTrue($carritoActivo->estaActivo());
        $this->assertFalse($carritoProcesado->estaActivo());
    }

    public function test_puede_obtener_total_productos_en_carrito(): void
    {
        $user = User::factory()->create();
        $cliente = Cliente::factory()->create(['user_id' => $user->id]);
        $carrito = Carrito::factory()->create(['cliente_id' => $cliente->id]);
        $producto1 = Producto::factory()->create();
        $producto2 = Producto::factory()->create();

        DetalleCarrito::create([
            'carrito_id' => $carrito->id,
            'producto_id' => $producto1->id,
            'cantidad' => 3,
            'precio_unitario' => 10.00,
            'subtotal' => 30.00,
        ]);

        DetalleCarrito::create([
            'carrito_id' => $carrito->id,
            'producto_id' => $producto2->id,
            'cantidad' => 2,
            'precio_unitario' => 15.00,
            'subtotal' => 30.00,
        ]);

        $this->assertEquals(5, $carrito->total_productos);
    }

    public function test_campos_fillable_correctos(): void
    {
        $fillable = ['cliente_id', 'fecha', 'total', 'estado'];
        $carrito = new Carrito();

        $this->assertEquals($fillable, $carrito->getFillable());
    }

    public function test_casts_correctos(): void
    {
        $carrito = new Carrito();
        $casts = $carrito->getCasts();

        $this->assertEquals('date', $casts['fecha']);
        $this->assertEquals('decimal:2', $casts['total']);
    }
}
