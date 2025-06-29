<?php

declare(strict_types=1);

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\RoleEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'user';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nombre',
        'celular',
        'email',
        'genero',
        'password',
        'estado',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relación con Cliente
     */
    public function cliente(): HasOne
    {
        return $this->hasOne(Cliente::class);
    }

    /**
     * Relación con Administrativo
     */
    public function administrativo(): HasOne
    {
        return $this->hasOne(Administrativo::class);
    }

    /**
     * Verifica si el usuario es un cliente
     */
    public function esCliente(): bool
    {
        return $this->hasRole(RoleEnum::CLIENTE->value);
    }

    /**
     * Verifica si el usuario es un administrativo
     */
    public function esAdministrativo(): bool
    {
        return $this->hasRole(RoleEnum::ADMIN->value);
    }

    /**
     * Verifica si el usuario es empleado
     */
    public function esEmpleado(): bool
    {
        return $this->hasRole(RoleEnum::EMPLEADO->value);
    }

    /**
     * Verifica si el usuario es organizador
     */
    public function esOrganizador(): bool
    {
        return $this->hasRole(RoleEnum::ORGANIZADOR->value);
    }

    /**
     * Verifica si el usuario tiene un rol específico usando el enum
     */
    public function tieneRol(RoleEnum $role): bool
    {
        return $this->hasRole($role->value);
    }

    /**
     * Verifica si el usuario tiene alguno de los roles especificados
     */
    public function tieneAlgunRol(array $roles): bool
    {
        $roleNames = array_map(fn($role) => $role->value, $roles);
        return $this->hasAnyRole($roleNames);
    }

    /**
     * Asigna un rol usando el enum (a ambos sistemas)
     */
    public function asignarRol(RoleEnum $role): self
    {
        $this->assignRole($role->value);
        return $this;
    }

    /**
     * Remueve un rol usando el enum (de ambos sistemas)
     */
    public function removerRol(RoleEnum $role): self
    {
        $this->removeRole($role->value);
        return $this;
    }

    /**
     * Obtiene el rol principal del usuario
     */
    public function getRolPrincipal(): ?RoleEnum
    {
        $primerRol = $this->roles->first();
        if ($primerRol) {
            return RoleEnum::tryFrom($primerRol->name);
        }
        return null;
    }

    /**
     * Verifica si el usuario está activo
     */
    public function estaActivo(): bool
    {
        return $this->estado === 'activo';
    }

    /**
     * Obtiene todos los permisos del usuario (ambos sistemas)
     */
    public function getTodosLosPermisos(): array
    {
        return $this->getAllPermissions()->pluck('name')->toArray();
    }
}
