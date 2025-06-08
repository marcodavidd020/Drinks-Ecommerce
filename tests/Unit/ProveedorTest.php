<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Models\NotaCompra;
use App\Models\Pempresa;
use App\Models\Pqrsona;
use App\Models\Proveedor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProveedorTest extends TestCase
{
    use RefreshDatabase;

    public function test_puede_crear_proveedor_persona(): void
    {
        $persona = Pqrsona::create([
            'nombre' => 'Juan',
            'apellido' => 'Pérez',
            'telefono' => '123456789',
            'email' => 'juan@example.com',
            'tipo' => 'queja',
            'descripcion' => 'Test',
            'fecha_creacion' => now()->toDateString(),
        ]);

        $proveedor = Proveedor::create([
            'nombre' => 'Juan Pérez',
            'telefono' => '123456789',
            'direccion' => 'Calle 123',
            'email' => 'juan@example.com',
            'tipo' => 'persona',
            'proveedorable_id' => $persona->id,
            'proveedorable_type' => Pqrsona::class,
        ]);

        $this->assertInstanceOf(Proveedor::class, $proveedor);
        $this->assertEquals('persona', $proveedor->tipo);
        $this->assertTrue($proveedor->esPersona());
        $this->assertFalse($proveedor->esEmpresa());
    }

    public function test_puede_crear_proveedor_empresa(): void
    {
        $empresa = Pempresa::create([
            'razon_social' => 'Empresa Test S.A.',
            'nit' => '123456789-1',
            'telefono' => '987654321',
            'email' => 'empresa@test.com',
        ]);

        $proveedor = Proveedor::create([
            'nombre' => 'Empresa Test S.A.',
            'telefono' => '987654321',
            'direccion' => 'Avenida 456',
            'email' => 'empresa@test.com',
            'tipo' => 'empresa',
            'proveedorable_id' => $empresa->id,
            'proveedorable_type' => Pempresa::class,
        ]);

        $this->assertInstanceOf(Proveedor::class, $proveedor);
        $this->assertEquals('empresa', $proveedor->tipo);
        $this->assertTrue($proveedor->esEmpresa());
        $this->assertFalse($proveedor->esPersona());
    }

    public function test_proveedor_tiene_relacion_polimorfica(): void
    {
        $persona = Pqrsona::create([
            'nombre' => 'María',
            'apellido' => 'García',
            'telefono' => '111111111',
            'email' => 'maria@example.com',
            'tipo' => 'peticion',
            'descripcion' => 'Test',
            'fecha_creacion' => now()->toDateString(),
        ]);

        $proveedor = Proveedor::create([
            'nombre' => 'María García',
            'telefono' => '111111111',
            'direccion' => 'Carrera 789',
            'email' => 'maria@example.com',
            'tipo' => 'persona',
            'proveedorable_id' => $persona->id,
            'proveedorable_type' => Pqrsona::class,
        ]);

        $this->assertInstanceOf(Pqrsona::class, $proveedor->proveedorable);
        $this->assertEquals($persona->id, $proveedor->proveedorable->id);
    }

    public function test_proveedor_tiene_muchas_notas_compra(): void
    {
        $proveedor = Proveedor::create([
            'nombre' => 'Test Proveedor',
            'telefono' => '123456789',
            'direccion' => 'Calle Test',
            'email' => 'test@proveedor.com',
        ]);

        $nota1 = NotaCompra::create([
            'proveedor_id' => $proveedor->id,
            'fecha' => now(),
            'total' => 100.00,
            'estado' => 'pendiente',
        ]);

        $nota2 = NotaCompra::create([
            'proveedor_id' => $proveedor->id,
            'fecha' => now(),
            'total' => 200.00,
            'estado' => 'recibida',
        ]);

        $this->assertCount(2, $proveedor->notasCompra);
        $this->assertTrue($proveedor->notasCompra->contains($nota1));
        $this->assertTrue($proveedor->notasCompra->contains($nota2));
    }

    public function test_puede_obtener_nombre_display(): void
    {
        $empresa = Pempresa::create([
            'razon_social' => 'Empresa Display Test',
            'nit' => '999999999-1',
            'telefono' => '555555555',
            'email' => 'display@test.com',
        ]);

        $proveedor = Proveedor::create([
            'nombre' => 'Empresa Display Test',
            'telefono' => '555555555',
            'direccion' => 'Display Street',
            'email' => 'display@test.com',
            'tipo' => 'empresa',
            'proveedorable_id' => $empresa->id,
            'proveedorable_type' => Pempresa::class,
        ]);

        // Load the relationship
        $proveedor->load('proveedorable');
        
        $this->assertEquals('Empresa Display Test', $proveedor->nombre_display);
    }

    public function test_persona_puede_tener_proveedor(): void
    {
        $persona = Pqrsona::create([
            'nombre' => 'Carlos',
            'apellido' => 'López',
            'telefono' => '222222222',
            'email' => 'carlos@example.com',
            'tipo' => 'sugerencia',
            'descripcion' => 'Test proveedor',
            'fecha_creacion' => now()->toDateString(),
        ]);

        $proveedor = $persona->proveedor()->create([
            'nombre' => 'Carlos López',
            'telefono' => '222222222',
            'direccion' => 'Carlos Street',
            'email' => 'carlos@example.com',
            'tipo' => 'persona',
        ]);

        $this->assertInstanceOf(Proveedor::class, $persona->proveedor);
        $this->assertEquals($proveedor->id, $persona->proveedor->id);
    }

    public function test_empresa_puede_tener_proveedor(): void
    {
        $empresa = Pempresa::create([
            'razon_social' => 'Empresa Relación Test',
            'nit' => '777777777-1',
            'telefono' => '333333333',
            'email' => 'relacion@test.com',
        ]);

        $proveedor = $empresa->proveedor()->create([
            'nombre' => 'Empresa Relación Test',
            'telefono' => '333333333',
            'direccion' => 'Relacion Avenue',
            'email' => 'relacion@test.com',
            'tipo' => 'empresa',
        ]);

        $this->assertInstanceOf(Proveedor::class, $empresa->proveedor);
        $this->assertEquals($proveedor->id, $empresa->proveedor->id);
    }

    public function test_campos_fillable_correctos(): void
    {
        $fillable = [
            'nombre', 'telefono', 'direccion', 'email',
            'tipo', 'proveedorable_id', 'proveedorable_type'
        ];
        $proveedor = new Proveedor();

        $this->assertEquals($fillable, $proveedor->getFillable());
    }
}
