import { BaseIndex } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

interface Permission {
    id: number;
    name: string;
    label: string;
    roles_count: number;
    guard_name: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // Add index signature for BaseEntity compatibility
}

interface PermissionsIndexProps {
    permissions: {
        data: Permission[];
        links: any[];
        meta?: any;
    };
    groupedPermissions: Record<string, string[]>;
    filters: {
        search: string;
        sort_by: string;
        sort_order: string;
        per_page: number;
    };
}

export default function PermissionsIndex({ permissions, groupedPermissions, filters }: PermissionsIndexProps) {
    const handleSyncPermissions = () => {
        if (confirm('¿Estás seguro de que deseas sincronizar los permisos con el sistema?')) {
            router.post('/admin/permissions/sync', {}, {
                preserveScroll: true,
            });
        }
    };

    const columns = [
        {
            key: 'name',
            label: {
                niños: '🛡️ Nombre del Permiso',
                jóvenes: 'Nombre del Permiso',
                adultos: 'Nombre del Permiso',
            },
            render: (value: unknown, item: unknown) => {
                const permission = item as Permission;
                const name = value as string;
                return (
                    <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                            {permission.label}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {name}
                        </div>
                    </div>
                );
            },
            sortable: true,
        },
        {
            key: 'roles_count',
            label: {
                niños: '🎭 Roles',
                jóvenes: 'Roles',
                adultos: 'Cantidad de Roles',
            },
            render: (value: unknown) => {
                const count = value as number;
                return (
                    <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800 dark:bg-green-900 dark:text-green-200">
                        {count} {count === 1 ? 'rol' : 'roles'}
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
            href: (item: Permission) => `/admin/permissions/${item.id}`,
            variant: 'secondary' as const,
        },
        {
            label: {
                niños: '✏️ Editar',
                jóvenes: 'Editar',
                adultos: 'Editar',
            },
            icon: '✏️',
            href: (item: Permission) => `/admin/permissions/${item.id}/edit`,
            variant: 'primary' as const,
        },
    ];

    // Renderizar estado vacío personalizado con botón de sincronización
    const renderEmptyState = () => (
        <div className="text-center py-12">
            <div className="text-6xl mb-4">🛡️</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No hay permisos registrados
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
                Comience sincronizando los permisos del sistema
            </p>
            <div className="flex justify-center gap-4">
                <Button
                    onClick={handleSyncPermissions}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    🔄 Sincronizar Permisos
                </Button>
                <Button
                    onClick={() => router.get('/admin/permissions/create')}
                    variant="outline"
                >
                    ➕ Crear Permiso
                </Button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Botón de sincronización */}
            <div className="flex justify-end">
                <Button
                    onClick={handleSyncPermissions}
                    variant="outline"
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
                >
                    🔄 Sincronizar Permisos
                </Button>
            </div>

            <BaseIndex
                data={permissions}
                filters={filters}
                entityName="permiso"
                routeName="admin/permissions"
                title={{
                    niños: '🛡️ ¡Mis Permisos!',
                    jóvenes: '🛡️ Permisos del Sistema',
                    adultos: 'Gestión de Permisos',
                }}
                description={{
                    niños: '¡Aquí puedes ver todos los permisos y poderes especiales!',
                    jóvenes: 'Administra los permisos del sistema',
                    adultos: 'Administre los permisos del sistema y controle el acceso',
                }}
                columns={columns}
                actions={actions}
                canDelete={true}
                renderEmptyState={renderEmptyState}
                onDelete={(item: Permission) => {
                    // Validación adicional en el frontend
                    const systemPermissions = Object.values(groupedPermissions).flat();
                    if (systemPermissions.includes(item.name)) {
                        alert('No se pueden eliminar los permisos del sistema');
                        return;
                    }
                }}
            />
        </div>
    );
} 