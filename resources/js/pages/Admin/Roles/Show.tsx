import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { ShowHeader, InfoCard } from '@/components/Show';

interface Permission {
    id: number;
    name: string;
    guard_name: string;
}

interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    permissions: Permission[];
}

interface RoleShowProps {
    role: Role;
}

export default function RoleShow({ role }: RoleShowProps) {
    const { getTextByMode } = useAppModeText();

    // Agrupar permisos por categoría
    const groupedPermissions = role.permissions.reduce((acc, permission) => {
        const category = permission.name.split('-')[0] || 'otros';
        if (!acc[category]) acc[category] = [];
        acc[category].push(permission);
        return acc;
    }, {} as Record<string, Permission[]>);

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: `🎭 Rol: ${role.name}`,
                jóvenes: `Rol: ${role.name}`,
                adultos: `Detalles del Rol: ${role.name}`,
            })}
        >
            <Head title={`Rol: ${role.name}`} />

            <div className="space-y-6">
                <ShowHeader
                    title={{
                        niños: `🎭 ${role.name}`,
                        jóvenes: `Rol: ${role.name}`,
                        adultos: `Detalles del Rol: ${role.name}`,
                    }}
                    description={{
                        niños: '¡Aquí puedes ver todos los súper poderes de este rol!',
                        jóvenes: 'Información detallada del rol y sus permisos',
                        adultos: 'Información completa del rol del sistema y sus permisos asociados',
                    }}
                    editUrl={`/admin/roles/${role.id}/edit`}
                    backUrl="/admin/roles"
                    editText={{
                        niños: '✏️ ¡Editar Rol!',
                        jóvenes: 'Editar Rol',
                        adultos: 'Editar Rol',
                    }}
                    backText={{
                        niños: '⬅️ Volver a Roles',
                        jóvenes: 'Volver a Roles',
                        adultos: 'Volver a Roles',
                    }}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Información básica */}
                    <div className="lg:col-span-1">
                        <InfoCard
                            title={{
                                niños: '📋 Info del Rol',
                                jóvenes: 'Información del Rol',
                                adultos: 'Información del Rol',
                            }}
                            items={[
                                {
                                    label: {
                                        niños: '🎭 Nombre',
                                        jóvenes: 'Nombre',
                                        adultos: 'Nombre',
                                    },
                                    value: role.name,
                                },
                                {
                                    label: {
                                        niños: '🛡️ Guardia',
                                        jóvenes: 'Guard Name',
                                        adultos: 'Guard Name',
                                    },
                                    value: role.guard_name,
                                },
                                {
                                    label: {
                                        niños: '🔢 Total Permisos',
                                        jóvenes: 'Total de Permisos',
                                        adultos: 'Total de Permisos',
                                    },
                                    value: `${role.permissions.length} ${role.permissions.length === 1 ? 'permiso' : 'permisos'}`,
                                },
                                {
                                    label: {
                                        niños: '📅 Creado',
                                        jóvenes: 'Fecha de Creación',
                                        adultos: 'Fecha de Creación',
                                    },
                                    value: new Date(role.created_at).toLocaleDateString('es-CO', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    }),
                                },
                                {
                                    label: {
                                        niños: '📝 Actualizado',
                                        jóvenes: 'Última Actualización',
                                        adultos: 'Última Actualización',
                                    },
                                    value: new Date(role.updated_at).toLocaleDateString('es-CO', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    }),
                                },
                            ]}
                        />
                    </div>

                    {/* Permisos del rol */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
                                {getTextByMode({
                                    niños: '🛡️ Súper Poderes del Rol',
                                    jóvenes: 'Permisos del Rol',
                                    adultos: 'Permisos Asignados',
                                })}
                            </h3>

                            {role.permissions.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-2">😔</div>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {getTextByMode({
                                            niños: 'Este rol no tiene súper poderes todavía',
                                            jóvenes: 'Este rol no tiene permisos asignados',
                                            adultos: 'No hay permisos asignados a este rol',
                                        })}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                                        <div key={category} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 capitalize">
                                                {category.replace('-', ' ')}
                                            </h4>
                                            <div className="space-y-2">
                                                {categoryPermissions.map((permission) => (
                                                    <div
                                                        key={permission.id}
                                                        className="flex items-center space-x-2"
                                                    >
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                            ✓
                                                        </span>
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                                            {permission.name.replace('-', ' ')}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
} 