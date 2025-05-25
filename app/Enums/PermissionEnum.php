<?php

declare(strict_types=1);

namespace App\Enums;

enum PermissionEnum: string
{
    // Permisos de usuarios
    case CREAR_USUARIOS = 'crear-usuarios';
    case EDITAR_USUARIOS = 'editar-usuarios';
    case ELIMINAR_USUARIOS = 'eliminar-usuarios';
    case VER_USUARIOS = 'ver-usuarios';

    // Permisos de clientes
    case CREAR_CLIENTES = 'crear-clientes';
    case EDITAR_CLIENTES = 'editar-clientes';
    case ELIMINAR_CLIENTES = 'eliminar-clientes';
    case VER_CLIENTES = 'ver-clientes';

    // Permisos de administrativos
    case CREAR_ADMINISTRATIVOS = 'crear-administrativos';
    case EDITAR_ADMINISTRATIVOS = 'editar-administrativos';
    case ELIMINAR_ADMINISTRATIVOS = 'eliminar-administrativos';
    case VER_ADMINISTRATIVOS = 'ver-administrativos';

    // Permisos de gestión
    case GESTIONAR_ROLES = 'gestionar-roles';
    case GESTIONAR_PERMISOS = 'gestionar-permisos';

    // Permisos generales
    case ACCESO_DASHBOARD = 'acceso-dashboard';
    case VER_REPORTES = 'ver-reportes';

    /**
     * Obtiene todos los valores de los permisos
     *
     * @return array<string>
     */
    public static function values(): array
    {
        return array_map(fn(self $permission) => $permission->value, self::cases());
    }
} 