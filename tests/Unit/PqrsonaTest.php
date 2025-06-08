<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Models\Administrativo;
use App\Models\Pqrsona;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PqrsonaTest extends TestCase
{
    use RefreshDatabase;

    public function test_puede_crear_pqrsona(): void
    {
        $pqrsona = Pqrsona::create([
            'nombre' => 'Juan',
            'apellido' => 'Pérez',
            'telefono' => '123456789',
            'email' => 'juan@example.com',
            'tipo' => 'queja',
            'descripcion' => 'Descripción de la queja',
            'estado' => 'pendiente',
            'fecha_creacion' => now()->toDateString(),
        ]);

        $this->assertInstanceOf(Pqrsona::class, $pqrsona);
        $this->assertEquals('Juan', $pqrsona->nombre);
        $this->assertEquals('queja', $pqrsona->tipo);
        $this->assertEquals('pendiente', $pqrsona->estado);
    }

    public function test_pqrsona_puede_pertenecer_a_administrativo(): void
    {
        $user = User::factory()->create();
        $administrativo = Administrativo::factory()->create(['user_id' => $user->id]);
        
        $pqrsona = Pqrsona::create([
            'nombre' => 'María',
            'apellido' => 'González',
            'tipo' => 'reclamo',
            'descripcion' => 'Descripción del reclamo',
            'fecha_creacion' => now()->toDateString(),
            'administrativo_id' => $administrativo->id,
        ]);

        $this->assertInstanceOf(Administrativo::class, $pqrsona->administrativo);
        $this->assertEquals($administrativo->id, $pqrsona->administrativo->id);
    }

    public function test_puede_verificar_si_esta_pendiente(): void
    {
        $pqrsonaPendiente = Pqrsona::create([
            'nombre' => 'Carlos',
            'apellido' => 'López',
            'tipo' => 'peticion',
            'descripcion' => 'Descripción de la petición',
            'estado' => 'pendiente',
            'fecha_creacion' => now()->toDateString(),
        ]);

        $pqrsonaResuelta = Pqrsona::create([
            'nombre' => 'Ana',
            'apellido' => 'Martín',
            'tipo' => 'sugerencia',
            'descripcion' => 'Descripción de la sugerencia',
            'estado' => 'resuelto',
            'fecha_creacion' => now()->toDateString(),
        ]);

        $this->assertTrue($pqrsonaPendiente->estaPendiente());
        $this->assertFalse($pqrsonaResuelta->estaPendiente());
    }

    public function test_puede_verificar_si_esta_resuelta(): void
    {
        $pqrsonaResuelta = Pqrsona::create([
            'nombre' => 'Luis',
            'apellido' => 'Rodríguez',
            'tipo' => 'queja',
            'descripcion' => 'Descripción de la queja',
            'estado' => 'resuelto',
            'fecha_creacion' => now()->toDateString(),
        ]);

        $pqrsonaPendiente = Pqrsona::create([
            'nombre' => 'Elena',
            'apellido' => 'Fernández',
            'tipo' => 'reclamo',
            'descripcion' => 'Descripción del reclamo',
            'estado' => 'pendiente',
            'fecha_creacion' => now()->toDateString(),
        ]);

        $this->assertTrue($pqrsonaResuelta->estaResuelta());
        $this->assertFalse($pqrsonaPendiente->estaResuelta());
    }

    public function test_puede_obtener_nombre_completo(): void
    {
        $pqrsona = Pqrsona::create([
            'nombre' => 'Pedro',
            'apellido' => 'Sánchez',
            'tipo' => 'peticion',
            'descripcion' => 'Descripción de la petición',
            'fecha_creacion' => now()->toDateString(),
        ]);

        $this->assertEquals('Pedro Sánchez', $pqrsona->nombre_completo);
    }

    public function test_puede_marcar_como_respondida(): void
    {
        $user = User::factory()->create();
        $administrativo = Administrativo::factory()->create(['user_id' => $user->id]);
        
        $pqrsona = Pqrsona::create([
            'nombre' => 'Isabel',
            'apellido' => 'Torres',
            'tipo' => 'queja',
            'descripcion' => 'Descripción de la queja',
            'estado' => 'pendiente',
            'fecha_creacion' => now()->toDateString(),
        ]);

        $respuesta = 'Respuesta a la queja';
        $pqrsona->marcarComoRespondida($respuesta, $administrativo->id);

        $pqrsona->refresh();

        $this->assertEquals($respuesta, $pqrsona->respuesta);
        $this->assertEquals('resuelto', $pqrsona->estado);
        $this->assertEquals($administrativo->id, $pqrsona->administrativo_id);
        $this->assertEquals(now()->toDateString(), $pqrsona->fecha_respuesta->toDateString());
    }

    public function test_campos_fillable_correctos(): void
    {
        $fillable = [
            'nombre', 'apellido', 'telefono', 'direccion', 'email',
            'tipo', 'descripcion', 'estado', 'fecha_creacion',
            'fecha_respuesta', 'respuesta', 'administrativo_id'
        ];
        $pqrsona = new Pqrsona();

        $this->assertEquals($fillable, $pqrsona->getFillable());
    }

    public function test_casts_correctos(): void
    {
        $pqrsona = new Pqrsona();
        $casts = $pqrsona->getCasts();

        $this->assertEquals('date', $casts['fecha_creacion']);
        $this->assertEquals('date', $casts['fecha_respuesta']);
    }
}
