<?php

declare(strict_types=1);

namespace Tests\Unit;

use App\Enums\RoleEnum;
use App\Models\Administrativo;
use App\Models\Cliente;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Crear roles necesarios para las pruebas
        Role::create(['name' => RoleEnum::CLIENTE->value]);
        Role::create(['name' => RoleEnum::ADMIN->value]);
        Role::create(['name' => RoleEnum::EMPLEADO->value]);
    }

    public function test_user_can_be_created_with_required_fields(): void
    {
        $user = User::factory()->create([
            'nombre' => 'Juan Pérez',
            'email' => 'juan@example.com',
            'estado' => 'activo'
        ]);

        $this->assertDatabaseHas('users', [
            'nombre' => 'Juan Pérez',
            'email' => 'juan@example.com',
            'estado' => 'activo'
        ]);

        $this->assertInstanceOf(User::class, $user);
    }

    public function test_user_has_cliente_relationship(): void
    {
        $user = User::factory()->create();
        
        $cliente = Cliente::factory()->create([
            'user_id' => $user->id
        ]);

        $this->assertInstanceOf(Cliente::class, $user->cliente);
        $this->assertEquals($cliente->id, $user->cliente->id);
    }

    public function test_user_has_administrativo_relationship(): void
    {
        $user = User::factory()->create();
        
        $administrativo = Administrativo::factory()->create([
            'user_id' => $user->id
        ]);

        $this->assertInstanceOf(Administrativo::class, $user->administrativo);
        $this->assertEquals($administrativo->id, $user->administrativo->id);
    }

    public function test_user_can_check_if_is_cliente(): void
    {
        $user = User::factory()->create();
        
        // Usuario sin cliente
        $this->assertFalse($user->esCliente());
        
        // Usuario con cliente
        Cliente::factory()->create(['user_id' => $user->id]);
        $user->refresh();
        
        $this->assertTrue($user->esCliente());
    }

    public function test_user_can_check_if_is_administrativo(): void
    {
        $user = User::factory()->create();
        
        // Usuario sin administrativo
        $this->assertFalse($user->esAdministrativo());
        
        // Usuario con administrativo
        Administrativo::factory()->create(['user_id' => $user->id]);
        $user->refresh();
        
        $this->assertTrue($user->esAdministrativo());
    }

    public function test_user_can_have_roles(): void
    {
        $user = User::factory()->create();
        
        $user->assignRole(RoleEnum::CLIENTE->value);
        
        $this->assertTrue($user->hasRole(RoleEnum::CLIENTE->value));
        $this->assertFalse($user->hasRole(RoleEnum::ADMIN->value));
    }

    public function test_user_password_is_hashed(): void
    {
        $user = User::factory()->create([
            'password' => 'password123'
        ]);

        $this->assertNotEquals('password123', $user->password);
        $this->assertTrue(password_verify('password123', $user->password));
    }

    public function test_user_fillable_attributes(): void
    {
        $fillable = [
            'nombre',
            'celular',
            'email',
            'genero',
            'password',
            'estado',
        ];

        $user = new User();
        
        $this->assertEquals($fillable, $user->getFillable());
    }

    public function test_user_estado_enum_validation(): void
    {
        $user = User::factory()->create(['estado' => 'activo']);
        $this->assertEquals('activo', $user->estado);

        $user->update(['estado' => 'inactivo']);
        $this->assertEquals('inactivo', $user->estado);
    }

    public function test_user_genero_enum_validation(): void
    {
        $generos = ['masculino', 'femenino', 'otro'];
        
        foreach ($generos as $genero) {
            $user = User::factory()->create(['genero' => $genero]);
            $this->assertEquals($genero, $user->genero);
        }
    }
}
