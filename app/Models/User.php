<?php

declare(strict_types=1);

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\RoleEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
     * @var array<int, string>
     */
    protected $fillable = [
        'nombre',
        'email',
        'password',
        'celular',
        'genero',
        'estado',
        'email_verified_at',
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
        return $this->hasOne(Cliente::class, 'user_id');
    }

    /**
     * Relación con Administrativo
     */
    public function administrativo(): HasOne
    {
        return $this->hasOne(Administrativo::class, 'user_id');
    }

    /**
     * Relación con Carrito
     */
    public function carrito(): HasMany
    {
        return $this->hasMany(Carrito::class, 'user_id');
    }

    /**
     * Relación con DetalleCarrito
     */
    public function detalleCarritos(): HasMany
    {
        return $this->hasMany(DetalleCarrito::class, 'user_id');
    }

    /**
     * Verifica si el usuario está activo
     */
    public function estaActivo(): bool
    {
        return $this->estado === 'activo';
    }

    /**
     * Obtiene el rol principal del usuario (el primero asignado)
     */
    public function getRolPrincipal(): ?string
    {
        return $this->roles->first()?->name;
    }

    /**
     * Verifica si el usuario tiene un rol específico usando el enum
     * (Método de compatibilidad, se recomienda usar hasRole directamente)
     */
    public function tieneRol(RoleEnum $role): bool
    {
        return $this->hasRole($role->value);
    }

    /**
     * Verifica si el usuario tiene alguno de los roles especificados usando enums
     * (Método de compatibilidad, se recomienda usar hasAnyRole directamente)
     */
    public function tieneAlgunRol(array $roles): bool
    {
        $roleNames = array_map(fn($role) => $role->value, $roles);
        return $this->hasAnyRole($roleNames);
    }

    /**
     * Asigna un rol usando el enum
     * (Método de compatibilidad, se recomienda usar assignRole directamente)
     */
    public function asignarRol(RoleEnum $role): self
    {
        $this->assignRole($role->value);
        return $this;
    }

    /**
     * Remueve un rol usando el enum
     * (Método de compatibilidad, se recomienda usar removeRole directamente)
     */
    public function removerRol(RoleEnum $role): self
    {
        $this->removeRole($role->value);
        return $this;
    }

    /**
     * Obtiene todos los permisos del usuario (tanto directos como a través de roles)
     */
    public function getTodosLosPermisos(): array
    {
        return $this->getAllPermissions()->pluck('name')->toArray();
    }

    /**
     * Verifica si el usuario tiene acceso al dashboard basado en permisos
     * (Genérico - no asume roles específicos)
     */
    public function tieneAccesoDashboard(): bool
    {
        return $this->can('ver dashboard') || 
               $this->hasAnyRole(['admin', 'empleado', 'organizador', 'vendedor', 'almacenista']);
    }

    /**
     * Métodos de conveniencia basados en permisos (no en roles específicos)
     */
    
    /**
     * Verifica si puede gestionar usuarios basado en permisos
     */
    public function puedeGestionarUsuarios(): bool
    {
        return $this->can('gestionar usuarios');
    }

    /**
     * Verifica si puede gestionar productos basado en permisos
     */
    public function puedeGestionarProductos(): bool
    {
        return $this->can('gestionar productos');
    }

    /**
     * Verifica si puede gestionar ventas basado en permisos
     */
    public function puedeGestionarVentas(): bool
    {
        return $this->can('gestionar ventas');
    }

    /**
     * Verifica si puede gestionar compras basado en permisos
     */
    public function puedeGestionarCompras(): bool
    {
        return $this->can('gestionar compras');
    }

    /**
     * Verifica si puede gestionar promociones basado en permisos
     */
    public function puedeGestionarPromociones(): bool
    {
        return $this->can('gestionar promociones');
    }

    /**
     * Verifica si puede gestionar inventario basado en permisos
     */
    public function puedeGestionarInventario(): bool
    {
        return $this->can('gestionar inventario');
    }

    /**
     * Verifica si puede gestionar roles y permisos (acceso admin)
     */
    public function puedeGestionarSistema(): bool
    {
        return $this->can('gestionar roles') || $this->can('gestionar permisos');
    }

    // Métodos de conveniencia para roles comunes (pero genéricos)
    
    /**
     * Verifica si es cliente (genérico)
     */
    public function esCliente(): bool
    {
        return $this->hasRole('cliente') && 
               !$this->hasAnyRole(['admin', 'empleado', 'organizador', 'vendedor', 'almacenista']);
    }

    /**
     * Verifica si es administrativo (tiene roles de gestión)
     */
    public function esAdministrativo(): bool
    {
        return $this->hasAnyRole(['admin', 'empleado', 'organizador', 'vendedor', 'almacenista']);
    }

    /**
     * Verifica si es admin (genérico)
     */
    public function esAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    /**
     * Verifica si es empleado (genérico)
     */
    public function esEmpleado(): bool
    {
        return $this->hasRole('empleado');
    }
}
