<?php

declare(strict_types=1);

namespace App\Helpers;

use App\Enums\RoleEnum;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthHelper
{
    /**
     * Verifica si el usuario autenticado tiene un rol específico
     */
    public static function hasRole(RoleEnum $role): bool
    {
        return Auth::check() && Auth::user()->hasRole($role->value);
    }

    /**
     * Verifica si el usuario autenticado tiene alguno de los roles especificados
     *
     * @param array<RoleEnum> $roles
     */
    public static function hasAnyRole(array $roles): bool
    {
        if (!Auth::check()) {
            return false;
        }

        $roleValues = array_map(fn(RoleEnum $role) => $role->value, $roles);
        return Auth::user()->hasAnyRole($roleValues);
    }

    /**
     * Verifica si el usuario autenticado es administrador
     */
    public static function isAdmin(): bool
    {
        return self::hasAnyRole([RoleEnum::SUPER_ADMIN, RoleEnum::ADMIN]);
    }

    /**
     * Verifica si el usuario autenticado es cliente
     */
    public static function isCliente(): bool
    {
        return self::hasRole(RoleEnum::CLIENTE);
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
} 