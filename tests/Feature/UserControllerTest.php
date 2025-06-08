<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\PermissionEnum;
use App\Enums\RoleEnum;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;
    protected User $normalUser;

    protected function setUp(): void
    {
        parent::setUp();

        // Crear permisos y roles
        foreach (PermissionEnum::values() as $permission) {
            Permission::create(['name' => $permission]);
        }

        $adminRole = Role::create(['name' => RoleEnum::ADMIN->value]);
        $clienteRole = Role::create(['name' => RoleEnum::CLIENTE->value]);

        // Asignar permisos al rol admin
        $adminRole->givePermissionTo([
            PermissionEnum::VER_USUARIOS->value,
            PermissionEnum::CREAR_USUARIOS->value,
            PermissionEnum::EDITAR_USUARIOS->value,
            PermissionEnum::ELIMINAR_USUARIOS->value,
        ]);

        // Crear usuarios de prueba
        $this->adminUser = User::factory()->create();
        $this->adminUser->assignRole($adminRole);

        $this->normalUser = User::factory()->create();
        $this->normalUser->assignRole($clienteRole);
    }

    public function test_admin_can_view_users_index(): void
    {
        $response = $this->actingAs($this->adminUser)
            ->get(route('users.index'));

        $response->assertStatus(200);
    }

    public function test_user_without_permission_cannot_view_users_index(): void
    {
        $response = $this->actingAs($this->normalUser)
            ->get(route('users.index'));

        $response->assertStatus(403);
    }

    public function test_admin_can_view_create_user_form(): void
    {
        $response = $this->actingAs($this->adminUser)
            ->get(route('users.create'));

        $response->assertStatus(200);
    }

    public function test_admin_can_create_user(): void
    {
        $userData = [
            'nombre' => 'Nuevo Usuario',
            'email' => 'nuevo@example.com',
            'celular' => '+1234567890',
            'genero' => 'masculino',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'estado' => 'activo',
        ];

        $response = $this->actingAs($this->adminUser)
            ->post(route('users.store'), $userData);

        $response->assertRedirect(route('users.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('users', [
            'nombre' => 'Nuevo Usuario',
            'email' => 'nuevo@example.com',
        ]);
    }

    public function test_create_user_validation_fails_with_invalid_data(): void
    {
        $invalidData = [
            'nombre' => '',
            'email' => 'invalid-email',
            'password' => '123', // Muy corta
            'estado' => 'invalid_status',
        ];

        $response = $this->actingAs($this->adminUser)
            ->post(route('users.store'), $invalidData);

        $response->assertSessionHasErrors(['nombre', 'email', 'password', 'estado']);
    }

    public function test_admin_can_view_specific_user(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($this->adminUser)
            ->get(route('users.show', $user));

        $response->assertStatus(200);
    }

    public function test_admin_can_view_edit_user_form(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($this->adminUser)
            ->get(route('users.edit', $user));

        $response->assertStatus(200);
    }

    public function test_admin_can_update_user(): void
    {
        $user = User::factory()->create();

        $updateData = [
            'nombre' => 'Nombre Actualizado',
            'email' => $user->email,
            'celular' => '+0987654321',
            'genero' => 'femenino',
            'estado' => 'inactivo',
        ];

        $response = $this->actingAs($this->adminUser)
            ->put(route('users.update', $user), $updateData);

        $response->assertRedirect(route('users.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'nombre' => 'Nombre Actualizado',
            'estado' => 'inactivo',
        ]);
    }

    public function test_admin_can_delete_user(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($this->adminUser)
            ->delete(route('users.destroy', $user));

        $response->assertRedirect(route('users.index'));
        $response->assertSessionHas('success');

        $this->assertDatabaseMissing('users', [
            'id' => $user->id,
        ]);
    }

    public function test_user_cannot_delete_themselves(): void
    {
        $response = $this->actingAs($this->adminUser)
            ->delete(route('users.destroy', $this->adminUser));

        $response->assertRedirect(route('users.index'));
        $response->assertSessionHas('error');

        $this->assertDatabaseHas('users', [
            'id' => $this->adminUser->id,
        ]);
    }

    public function test_user_without_permission_cannot_create_user(): void
    {
        $userData = [
            'nombre' => 'Nuevo Usuario',
            'email' => 'nuevo@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'estado' => 'activo',
        ];

        $response = $this->actingAs($this->normalUser)
            ->post(route('users.store'), $userData);

        $response->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_access_users_routes(): void
    {
        $user = User::factory()->create();

        // Test todas las rutas requieren autenticación
        $routes = [
            ['GET', route('users.index')],
            ['GET', route('users.create')],
            ['GET', route('users.show', $user)],
            ['GET', route('users.edit', $user)],
        ];

        foreach ($routes as [$method, $route]) {
            $response = $this->call($method, $route);
            $response->assertRedirect(route('login'));
        }
    }
}
