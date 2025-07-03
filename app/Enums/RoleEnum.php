<?php

declare(strict_types=1);

namespace App\Enums;

enum RoleEnum: string
{
    case ADMIN = 'admin';
    case CLIENTE = 'cliente';
    case VENDEDOR = 'vendedor';

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
        return $this === self::ADMIN;
    }

    /**
     * Verifica si el rol es de gestión (admin, vendedor)
     */
    public function esGestion(): bool
    {
        return in_array($this, [self::ADMIN, self::VENDEDOR]);
    }

    /**
     * Verifica si es un rol de cliente
     */
    public function esCliente(): bool
    {
        return $this === self::CLIENTE;
    }

    /**
     * Obtiene la etiqueta en español del rol
     */
    public function label(): string
    {
        return match ($this) {
            self::ADMIN => 'Administrador',
            self::CLIENTE => 'Cliente',
            self::VENDEDOR => 'Vendedor',
        };
    }

    /**
     * Obtiene la descripción del rol
     */
    public function descripcion(): string
    {
        return match ($this) {
            self::ADMIN => 'Acceso completo a todas las funcionalidades del sistema',
            self::CLIENTE => 'Acceso al portal de cliente para ver productos y realizar compras',
            self::VENDEDOR => 'Gestión de ventas, atención al cliente y productos',
        };
    }

    /**
     * Obtiene el color asociado al rol para UI
     */
    public function color(): string
    {
        return match ($this) {
            self::ADMIN => 'red',
            self::CLIENTE => 'green',
            self::VENDEDOR => 'orange',
        };
    }

    /**
     * Obtiene el icono asociado al rol
     */
    public function icono(): string
    {
        return match ($this) {
            self::ADMIN => '🛡️',
            self::CLIENTE => '👤',
            self::VENDEDOR => '💼',
        };
    }

    /**
     * Obtiene los roles que pueden ser asignados por este rol
     *
     * @return array<RoleEnum>
     */
    public function puedeAsignar(): array
    {
        return match ($this) {
            self::ADMIN => [self::VENDEDOR, self::CLIENTE],
            self::VENDEDOR => [self::CLIENTE],
            default => [],
        };
    }

    /**
     * Obtiene los roles administrativos
     *
     * @return array<RoleEnum>
     */
    public static function administrativos(): array
    {
        return [self::ADMIN];
    }

    /**
     * Obtiene los roles de gestión
     *
     * @return array<RoleEnum>
     */
    public static function gestion(): array
    {
        return [self::ADMIN, self::VENDEDOR];
    }

    /**
     * Obtiene los roles con acceso al dashboard
     *
     * @return array<RoleEnum>
     */
    public static function dashboardAccess(): array
    {
        return [self::ADMIN, self::VENDEDOR, self::CLIENTE];
    }

    /**
     * Obtiene el nivel de jerarquía del rol (mayor número = mayor jerarquía)
     */
    public function nivel(): int
    {
        return match ($this) {
            self::ADMIN => 100,
            self::VENDEDOR => 50,
            self::CLIENTE => 20,
        };
    }

    /**
     * Verifica si este rol tiene mayor jerarquía que otro
     */
    public function esSuperiorA(RoleEnum $otroRol): bool
    {
        return $this->nivel() > $otroRol->nivel();
    }

    /**
     * Obtiene los permisos base del rol según tu sistema
     *
     * @return array<string>
     */
    public function permisosBase(): array
    {
        return match ($this) {
            self::ADMIN => [
                // Todos los permisos
                'ver_usuarios', 'crear_usuarios', 'editar_usuarios', 'eliminar_usuarios',
                'ver_productos', 'crear_productos', 'editar_productos', 'eliminar_productos',
                'ver_ventas', 'crear_ventas', 'editar_ventas', 'eliminar_ventas',
                'ver_compras', 'crear_compras', 'editar_compras', 'eliminar_compras',
                'ver_promociones', 'crear_promociones', 'editar_promociones', 'eliminar_promociones',
                'ver_inventario', 'ajustar_inventario',
                'ver_reportes', 'generar_reportes',
                'configurar_sistema', 'gestionar_roles', 'gestionar_permisos',
            ],
            self::VENDEDOR => [
                // Permisos de ventas y gestión básica
                'ver_productos', 'crear_productos', 'editar_productos',
                'ver_clientes', 'crear_clientes', 'editar_clientes',
                'ver_ventas', 'crear_ventas', 'editar_ventas',
                'ver_compras', 'crear_compras',
                'ver_inventario', 'ajustar_inventario',
                'ver_promociones', 'crear_promociones', 'editar_promociones',
                'ver_reportes',
            ],
            self::CLIENTE => [
                // Permisos básicos de cliente
                'ver_productos', 'ver_promociones', 'gestionar_carrito', 'realizar_compras',
            ],
        };
    }
} 