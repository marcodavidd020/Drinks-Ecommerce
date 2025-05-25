<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Models\Pempresa;
use App\Models\Proveedor;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PempresaTest extends TestCase
{
    use RefreshDatabase;

    public function test_puede_crear_empresa(): void
    {
        $empresa = Pempresa::create([
            'razon_social' => 'Empresa Test S.A.S.',
            'nit' => '900123456-1',
            'telefono' => '601234567',
            'direccion' => 'Calle 123 #45-67',
            'email' => 'contacto@empresatest.com',
            'representante_legal' => 'Juan Carlos Pérez',
        ]);

        $this->assertInstanceOf(Pempresa::class, $empresa);
        $this->assertEquals('Empresa Test S.A.S.', $empresa->razon_social);
        $this->assertEquals('900123456-1', $empresa->nit);
        $this->assertEquals('Juan Carlos Pérez', $empresa->representante_legal);
    }

    public function test_empresa_puede_tener_proveedor(): void
    {
        $empresa = Pempresa::create([
            'razon_social' => 'Proveedora Test Ltda.',
            'nit' => '800456789-2',
            'telefono' => '607654321',
            'email' => 'ventas@proveedoratest.com',
        ]);

        $proveedor = $empresa->proveedor()->create([
            'nombre' => 'Proveedora Test Ltda.',
            'telefono' => '607654321',
            'direccion' => 'Test Avenue',
            'email' => 'ventas@proveedoratest.com',
            'tipo' => 'empresa',
        ]);

        $this->assertInstanceOf(Proveedor::class, $empresa->proveedor);
        $this->assertEquals($proveedor->id, $empresa->proveedor->id);
        $this->assertEquals('empresa', $empresa->proveedor->tipo);
    }

    public function test_puede_obtener_nombre_display(): void
    {
        $empresa = Pempresa::create([
            'razon_social' => 'Distribuidora ABC S.A.',
            'nit' => '900987654-3',
            'telefono' => '605555555',
            'email' => 'info@abc.com',
        ]);

        $this->assertEquals('Distribuidora ABC S.A.', $empresa->nombre_display);
    }

    public function test_nit_debe_ser_unico(): void
    {
        Pempresa::create([
            'razon_social' => 'Primera Empresa',
            'nit' => '123456789-0',
            'email' => 'primera@empresa.com',
        ]);

        $this->expectException(\Illuminate\Database\QueryException::class);

        Pempresa::create([
            'razon_social' => 'Segunda Empresa',
            'nit' => '123456789-0', // NIT duplicado
            'email' => 'segunda@empresa.com',
        ]);
    }

    public function test_email_debe_ser_unico_si_no_es_null(): void
    {
        Pempresa::create([
            'razon_social' => 'Empresa Email Test',
            'nit' => '111111111-1',
            'email' => 'test@unique.com',
        ]);

        $this->expectException(\Illuminate\Database\QueryException::class);

        Pempresa::create([
            'razon_social' => 'Otra Empresa Email',
            'nit' => '222222222-2',
            'email' => 'test@unique.com', // Email duplicado
        ]);
    }

    public function test_puede_crear_empresa_sin_campos_opcionales(): void
    {
        $empresa = Pempresa::create([
            'razon_social' => 'Empresa Mínima',
            'nit' => '555555555-5',
        ]);

        $this->assertInstanceOf(Pempresa::class, $empresa);
        $this->assertNull($empresa->telefono);
        $this->assertNull($empresa->direccion);
        $this->assertNull($empresa->email);
        $this->assertNull($empresa->representante_legal);
    }

    public function test_campos_fillable_correctos(): void
    {
        $fillable = [
            'razon_social',
            'nit',
            'telefono',
            'direccion',
            'email',
            'representante_legal',
        ];
        $empresa = new Pempresa();

        $this->assertEquals($fillable, $empresa->getFillable());
    }
}
