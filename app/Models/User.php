<?php

declare(strict_types=1);

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\RoleEnum;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
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
        'role', // Campo enum para compatibilidad
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
            'role' => 'string', // Cast del enum
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
     * Relación con roles personalizados (sistema personalizado)
     */
    public function rolesPersonalizados(): BelongsToMany
    {
        return $this->belongsToMany(Rol::class, 'user_rol', 'user_id', 'rol_id');
    }

    /**
     * Verifica si el usuario es un cliente
     */
    public function esCliente(): bool
    {
        // Verificar tanto en Spatie como en sistema personalizado
        $spatieCheck = $this->hasRole(RoleEnum::CLIENTE->value);
        $customCheck = $this->rolesPersonalizados()->where('nombre', 'cliente')->exists();
        
        return $this->cliente()->exists() || $spatieCheck || $customCheck;
    }

    /**
     * Verifica si el usuario es un administrativo
     */
    public function esAdministrativo(): bool
    {
        // Verificar tanto en Spatie como en sistema personalizado
        $spatieCheck = $this->hasRole(RoleEnum::ADMIN->value);
        $customCheck = $this->rolesPersonalizados()->where('nombre', 'admin')->exists();
        
        return $this->administrativo()->exists() || $spatieCheck || $customCheck;
    }

    /**
     * Verifica si el usuario es empleado
     */
    public function esEmpleado(): bool
    {
        $spatieCheck = $this->hasRole(RoleEnum::EMPLEADO->value);
        $customCheck = $this->rolesPersonalizados()->where('nombre', 'empleado')->exists();
        
        return $spatieCheck || $customCheck;
    }

    /**
     * Verifica si el usuario es organizador
     */
    public function esOrganizador(): bool
    {
        $spatieCheck = $this->hasRole(RoleEnum::ORGANIZADOR->value);
        $customCheck = $this->rolesPersonalizados()->where('nombre', 'organizador')->exists();
        
        return $spatieCheck || $customCheck;
    }

    /**
     * Verifica si el usuario tiene un rol específico usando el enum
     */
    public function tieneRol(RoleEnum $role): bool
    {
        // Verificar en ambos sistemas
        $spatieCheck = $this->hasRole($role->value);
        $customCheck = $this->rolesPersonalizados()->where('nombre', $role->value)->exists();
        
        return $spatieCheck || $customCheck;
    }

    /**
     * Verifica si el usuario tiene alguno de los roles especificados
     */
    public function tieneAlgunRol(array $roles): bool
    {
        foreach ($roles as $role) {
            if ($this->tieneRol($role)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Asigna un rol usando el enum (a ambos sistemas)
     */
    public function asignarRol(RoleEnum $role): self
    {
        // Asignar en Spatie
        $this->assignRole($role->value);
        
        // Asignar en sistema personalizado
        $rolPersonalizado = Rol::where('nombre', $role->value)->first();
        if ($rolPersonalizado && !$this->rolesPersonalizados()->where('rol_id', $rolPersonalizado->id)->exists()) {
            $this->rolesPersonalizados()->attach($rolPersonalizado->id);
        }
        
        // Sincronizar con el campo role para compatibilidad
        $this->update(['role' => $role->value]);
        
        return $this;
    }

    /**
     * Remueve un rol usando el enum (de ambos sistemas)
     */
    public function removerRol(RoleEnum $role): self
    {
        // Remover de Spatie
        $this->removeRole($role->value);
        
        // Remover del sistema personalizado
        $rolPersonalizado = Rol::where('nombre', $role->value)->first();
        if ($rolPersonalizado) {
            $this->rolesPersonalizados()->detach($rolPersonalizado->id);
        }
        
        return $this;
    }

    /**
     * Obtiene el rol principal del usuario
     */
    public function getRolPrincipal(): ?RoleEnum
    {
        // Primero intentar con Spatie
        $primerRolSpatie = $this->roles->first();
        if ($primerRolSpatie) {
            $enum = RoleEnum::tryFrom($primerRolSpatie->name);
            if ($enum) {
                return $enum;
            }
        }
        
        // Luego intentar con sistema personalizado
        $primerRolCustom = $this->rolesPersonalizados->first();
        if ($primerRolCustom) {
            return RoleEnum::tryFrom($primerRolCustom->nombre);
        }
        
        // Fallback al campo role
        if ($this->role) {
            return RoleEnum::tryFrom($this->role);
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
     * Sincroniza roles entre ambos sistemas
     */
    public function sincronizarRoles(): self
    {
        $rolesSpatie = $this->roles->pluck('name')->toArray();
        $rolesCustom = $this->rolesPersonalizados->pluck('nombre')->toArray();
        
        // Sincronizar roles faltantes en sistema personalizado
        foreach ($rolesSpatie as $roleName) {
            if (!in_array($roleName, $rolesCustom)) {
                $rolPersonalizado = Rol::where('nombre', $roleName)->first();
                if ($rolPersonalizado) {
                    $this->rolesPersonalizados()->attach($rolPersonalizado->id);
                }
            }
        }
        
        // Sincronizar roles faltantes en Spatie
        foreach ($rolesCustom as $roleName) {
            if (!in_array($roleName, $rolesSpatie)) {
                $this->assignRole($roleName);
            }
        }
        
        return $this;
    }

    /**
     * Obtiene todos los permisos del usuario (ambos sistemas)
     */
    public function getTodosLosPermisos(): array
    {
        $permisosSpatie = $this->getAllPermissions()->pluck('name')->toArray();
        
        $permisosCustom = $this->rolesPersonalizados()
            ->with('permisos')
            ->get()
            ->pluck('permisos')
            ->flatten()
            ->pluck('nombre')
            ->toArray();
        
        return array_unique(array_merge($permisosSpatie, $permisosCustom));
    }
}
