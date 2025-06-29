<?php

declare(strict_types=1);

namespace App\Helpers;

use App\Enums\RoleEnum;
use App\Enums\PermissionEnum;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthHelper
{
    /**
     * Verifica si el usuario autenticado tiene un rol específico
     */
    public static function hasRole(RoleEnum $role): bool
    {
        return Auth::check() && Auth::user()->tieneRol($role);
    }

    /**
     * Verifica si el usuario autenticado tiene alguno de los roles especificados
     *
     * @param array<RoleEnum> $roles
     */
    public static function hasAnyRole(array $roles): bool
    {
        return Auth::check() && Auth::user()->tieneAlgunRol($roles);
    }

    /**
     * Verifica si el usuario autenticado tiene todos los roles especificados
     *
     * @param array<RoleEnum> $roles
     */
    public static function hasAllRoles(array $roles): bool
    {
        if (!Auth::check()) {
            return false;
        }

        foreach ($roles as $role) {
            if (!Auth::user()->tieneRol($role)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Verifica si el usuario autenticado tiene un permiso específico
     */
    public static function hasPermission(PermissionEnum $permission): bool
    {
        return Auth::check() && Auth::user()->can($permission->value);
    }

    /**
     * Verifica si el usuario autenticado tiene alguno de los permisos especificados
     *
     * @param array<PermissionEnum> $permissions
     */
    public static function hasAnyPermission(array $permissions): bool
    {
        if (!Auth::check()) {
            return false;
        }

        $permissionValues = array_map(fn(PermissionEnum $permission) => $permission->value, $permissions);
        return Auth::user()->hasAnyPermission($permissionValues);
    }

    /**
     * Verifica si el usuario autenticado es administrador
     */
    public static function isAdmin(): bool
    {
        return self::hasRole(RoleEnum::ADMIN);
    }

    /**
     * Verifica si el usuario autenticado es cliente
     */
    public static function isCliente(): bool
    {
        return self::hasRole(RoleEnum::CLIENTE);
    }

    /**
     * Verifica si el usuario autenticado es empleado
     */
    public static function isEmpleado(): bool
    {
        return self::hasRole(RoleEnum::EMPLEADO);
    }

    /**
     * Verifica si el usuario autenticado es organizador
     */
    public static function isOrganizador(): bool
    {
        return self::hasRole(RoleEnum::ORGANIZADOR);
    }

    /**
     * Verifica si el usuario autenticado tiene rol de gestión
     */
    public static function isGestion(): bool
    {
        return self::hasAnyRole(RoleEnum::gestion());
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
     * Verifica si el usuario puede acceder al dashboard
     */
    public static function canAccessDashboard(): bool
    {
        if (!Auth::check()) {
            return false;
        }

        // Los clientes pueden acceder al dashboard básico
        // Los demás roles tienen acceso completo
        return Auth::user()->estaActivo() && (
            self::isAdmin() || 
            self::isGestion() || 
            self::isCliente()
        );
    }

    /**
     * Verifica si el usuario puede ver reportes
     */
    public static function canViewReports(): bool
    {
        if (!Auth::check()) {
            return false;
        }

        $user = Auth::user();
        $rolePermisos = $user->rolesPersonalizados()
            ->with('permisos')
            ->get()
            ->pluck('permisos')
            ->flatten()
            ->pluck('nombre')
            ->toArray();

        return in_array('ver_reportes', $rolePermisos) ||
               self::hasAnyRole([RoleEnum::ADMIN, RoleEnum::ORGANIZADOR]);
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
     * Verifica si el usuario autenticado puede gestionar otros usuarios
     */
    public static function canManageUsers(): bool
    {
        return self::hasAnyPermission([
            PermissionEnum::CREAR_USUARIOS,
            PermissionEnum::EDITAR_USUARIOS,
            PermissionEnum::ELIMINAR_USUARIOS,
            PermissionEnum::VER_USUARIOS
        ]);
    }

    /**
     * Verifica si el usuario puede gestionar productos
     */
    public static function canManageProducts(): bool
    {
        if (!Auth::check()) {
            return false;
        }

        // Verificar usando el sistema personalizado de permisos también
        $user = Auth::user();
        $rolePermisos = $user->rolesPersonalizados()
            ->with('permisos')
            ->get()
            ->pluck('permisos')
            ->flatten()
            ->pluck('nombre')
            ->toArray();

        return in_array('ver_productos', $rolePermisos) ||
               in_array('crear_productos', $rolePermisos) ||
               in_array('editar_productos', $rolePermisos);
    }

    /**
     * Verifica si el usuario puede gestionar ventas
     */
    public static function canManageSales(): bool
    {
        if (!Auth::check()) {
            return false;
        }

        $user = Auth::user();
        $rolePermisos = $user->rolesPersonalizados()
            ->with('permisos')
            ->get()
            ->pluck('permisos')
            ->flatten()
            ->pluck('nombre')
            ->toArray();

        return in_array('ver_ventas', $rolePermisos) ||
               in_array('crear_ventas', $rolePermisos) ||
               in_array('editar_ventas', $rolePermisos);
    }

    /**
     * Verifica si el usuario puede gestionar promociones
     */
    public static function canManagePromotions(): bool
    {
        if (!Auth::check()) {
            return false;
        }

        $user = Auth::user();
        $rolePermisos = $user->rolesPersonalizados()
            ->with('permisos')
            ->get()
            ->pluck('permisos')
            ->flatten()
            ->pluck('nombre')
            ->toArray();

        return in_array('ver_promociones', $rolePermisos) ||
               in_array('crear_promociones', $rolePermisos) ||
               in_array('editar_promociones', $rolePermisos);
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
} 