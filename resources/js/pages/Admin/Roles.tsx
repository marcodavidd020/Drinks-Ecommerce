import { BaseIndex } from '@/components/DataTable';

interface Role {
    id: number;
    name: string;
    permissions_count: number;
    guard_name: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // Add index signature for BaseEntity compatibility
}

interface RolesIndexProps {
    roles: {
        data: Role[];
        links: Array<{ url?: string; label: string; active: boolean }>;
        meta?: Record<string, unknown>;
    };
    filters: {
        search: string;
        sort_by: string;
        sort_order: string;
        per_page: number;
    };
}

export default function RolesIndex({ roles, filters }: RolesIndexProps) {
    const columns = [
        {
            key: 'name',
            label: {
                niños: '🎭 Nombre del Rol',
                jóvenes: 'Nombre del Rol',
                adultos: 'Nombre del Rol',
            },
            render: (value: unknown) => {
                const name = value as string;
                return (
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                        {name}
                    </div>
                );
            },
            sortable: true,
        },
        {
            key: 'permissions_count',
            label: {
                niños: '🛡️ Permisos',
                jóvenes: 'Permisos',
                adultos: 'Cantidad de Permisos',
            },
            render: (value: unknown) => {
                const count = value as number;
                return (
                    <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {count} {count === 1 ? 'permiso' : 'permisos'}
                    </span>
                );
            },
            sortable: true,
        },
        {
            key: 'guard_name',
            label: {
                niños: '🛡️ Guardia',
                jóvenes: 'Guardia',
                adultos: 'Guard Name',
            },
            render: (value: unknown) => {
                const guard = value as string;
                return (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {guard}
                    </span>
                );
            },
            sortable: true,
        },
        {
            key: 'created_at',
            label: {
                niños: '📅 Creado',
                jóvenes: 'Fecha Creación',
                adultos: 'Fecha de Creación',
            },
            render: (value: unknown) => {
                const dateValue = value as string;
                if (!dateValue) return 'Fecha no disponible';
                const date = new Date(dateValue);
                if (isNaN(date.getTime())) return 'Fecha inválida';
                return date.toLocaleDateString('es-CO', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                });
            },
            sortable: true,
        },
    ];

    const actions = [
        {
            label: {
                niños: '👀 Ver',
                jóvenes: 'Ver',
                adultos: 'Ver',
            },
            icon: '👀',
            href: (item: Role) => `/admin/roles/${item.id}`,
            variant: 'secondary' as const,
        },
        {
            label: {
                niños: '✏️ Editar',
                jóvenes: 'Editar',
                adultos: 'Editar',
            },
            icon: '✏️',
            href: (item: Role) => `/admin/roles/${item.id}/edit`,
            variant: 'primary' as const,
        },
    ];

    return (
        <BaseIndex
            data={roles}
            filters={filters}
            entityName="rol"
            routeName="admin/roles"
            title={{
                niños: '🎭 ¡Mis Roles!',
                jóvenes: '🎭 Roles del Sistema',
                adultos: 'Gestión de Roles',
            }}
            description={{
                niños: '¡Aquí puedes ver todos los roles y sus súper poderes!',
                jóvenes: 'Administra los roles y sus permisos',
                adultos: 'Administre los roles del sistema y sus permisos asociados',
            }}
            columns={columns}
            actions={actions}
            canDelete={true}
            onDelete={(item: Role) => {
                // Validación adicional en el frontend
                const systemRoles = ['admin', 'cliente', 'empleado', 'organizador'];
                if (systemRoles.includes(item.name)) {
                    alert('No se pueden eliminar los roles del sistema');
                    return;
                }
                // El resto se maneja por el BaseIndex por defecto
            }}
        />
    );
} 