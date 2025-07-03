<?php

declare(strict_types=1);

namespace App\Helpers;

use App\Enums\RoleEnum;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthHelper
{
    private static function check(callable $callback): bool
    {
        $user = Auth::user();
        return $user && $callback($user);
    }

    public static function hasRole(RoleEnum $role): bool
    {
        return self::check(fn(User $user) => $user->hasRole($role->value));
    }

    public static function hasAnyRole(array $roles): bool
    {
        $roleValues = array_map(fn($r) => $r->value, $roles);
        return self::check(fn(User $user) => $user->hasAnyRole($roleValues));
    }

    public static function hasPermission(string $permission): bool
    {
        return self::check(fn(User $user) => $user->can($permission));
    }

    public static function hasAnyPermission(array $permissions): bool
    {
        return self::check(fn(User $user) => $user->hasAnyPermission($permissions));
    }

    public static function isAdmin(): bool
    {
        return self::hasRole(RoleEnum::ADMIN);
    }

    public static function isCliente(): bool
    {
        return self::hasRole(RoleEnum::CLIENTE);
    }

    public static function isGestion(): bool
    {
        return self::hasAnyRole(RoleEnum::gestion());
    }

    public static function canAccessDashboard(): bool
    {
        return self::check(fn(User $user) => $user->estaActivo() && $user->hasAnyRole(RoleEnum::dashboardAccess()));
    }

    public static function canViewReports(): bool
    {
        return self::hasPermission('ver-reportes');
    }
    
    public static function canManageUsers(): bool
    {
        return self::hasAnyPermission(['crear-usuarios', 'editar-usuarios', 'eliminar-usuarios', 'ver-usuarios']);
    }

    public static function canManageProducts(): bool
    {
        return self::hasAnyPermission(['crear-productos', 'editar-productos', 'eliminar-productos', 'ver-productos', 'gestionar-inventario']);
    }

    public static function canManageSales(): bool
    {
        return self::hasAnyPermission(['crear-ventas', 'editar-ventas', 'eliminar-ventas', 'ver-ventas']);
    }
    
    public static function canManagePromotions(): bool
    {
        return self::hasAnyPermission(['crear-promociones', 'editar-promociones', 'eliminar-promociones', 'ver-promociones']);
    }

    /**
     * Obtiene el usuario autenticado
     */
    public static function user(): ?User
    {
        return Auth::user();
    }

    /**
     * Obtiene el tipo de usuario (cliente o administrativo)
     */
    public static function getUserType(): ?string
    {
        if (!Auth::check()) {
            return null;
        }

        $user = Auth::user();
        
        if ($user->esCliente()) {
            return 'cliente';
        }
        
        if ($user->esAdministrativo()) {
            return 'administrativo';
        }
        
        return null;
    }

    /**
     * Obtiene el rol principal del usuario autenticado
     */
    public static function getPrimaryRole(): ?RoleEnum
    {
        return Auth::check() ? Auth::user()->getRolPrincipal() : null;
    }

    /**
     * Obtiene todos los roles del usuario autenticado
     *
     * @return array<RoleEnum>
     */
    public static function getUserRoles(): array
    {
        if (!Auth::check()) {
            return [];
        }

        return Auth::user()->roles->map(function($role) {
            return RoleEnum::tryFrom($role->name);
        })->filter()->values()->toArray();
    }

    /**
     * Obtiene todos los permisos del usuario autenticado
     *
     * @return array<string>
     */
    public static function getUserPermissions(): array
    {
        return Auth::check() ? Auth::user()->getAllPermissions()->pluck('name')->toArray() : [];
    }

    /**
     * Verifica si el usuario está activo
     */
    public static function isActiveUser(): bool
    {
        return Auth::check() && Auth::user()->estaActivo();
    }

    /**
     * Obtiene el nombre completo del usuario autenticado
     */
    public static function getUserName(): ?string
    {
        return Auth::check() ? Auth::user()->nombre : null;
    }

    /**
     * Obtiene los permisos del sistema personalizado
     *
     * @return array<string>
     */
    public static function getCustomPermissions(): array
    {
        if (!Auth::check()) {
            return [];
        }

        return Auth::user()->rolesPersonalizados()
            ->with('permisos')
            ->get()
            ->pluck('permisos')
            ->flatten()
            ->pluck('nombre')
            ->unique()
            ->values()
            ->toArray();
    }

    /**
     * Verifica si el usuario es vendedor
     */
    public static function isVendedor(): bool
    {
        return self::hasRole(RoleEnum::VENDEDOR);
    }
} 