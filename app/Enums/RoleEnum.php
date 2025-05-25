<?php

declare(strict_types=1);

namespace App\Enums;

enum RoleEnum: string
{
    case SUPER_ADMIN = 'super-admin';
    case ADMIN = 'admin';
    case CLIENTE = 'cliente';
    case EMPLEADO = 'empleado';

    /**
     * Obtiene todos los valores de los roles
     *
     * @return array<string>
     */
    public static function values(): array
    {
        return array_map(fn(self $role) => $role->value, self::cases());
    }

    /**
     * Verifica si el rol es administrativo
     */
    public function esAdministrativo(): bool
    {
        return in_array($this, [self::SUPER_ADMIN, self::ADMIN]);
    }

    /**
     * Obtiene la etiqueta en español del rol
     */
    public function label(): string
    {
        return match ($this) {
            self::SUPER_ADMIN => 'Super Administrador',
            self::ADMIN => 'Administrador',
            self::CLIENTE => 'Cliente',
            self::EMPLEADO => 'Empleado',
        };
    }
} 