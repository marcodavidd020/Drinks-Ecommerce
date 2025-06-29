import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { ShowHeader, InfoCard } from '@/components/Show';

interface Role {
    id: number;
    name: string;
    guard_name: string;
}

interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    roles: Role[];
}

interface PermissionShowProps {
    permission: Permission;
}

export default function PermissionShow({ permission }: PermissionShowProps) {
    const { getTextByMode } = useAppModeText();

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: `🛡️ Permiso: ${permission.name}`,
                jóvenes: `Permiso: ${permission.name}`,
                adultos: `Detalles del Permiso: ${permission.name}`,
            })}
        >
            <Head title={`Permiso: ${permission.name}`} />

            <div className="space-y-6">
                <ShowHeader
                    title={getTextByMode({
                        niños: `🛡️ ${permission.name}`,
                        jóvenes: `Permiso: ${permission.name}`,
                        adultos: `Detalles del Permiso: ${permission.name}`,
                    })}
                    description={getTextByMode({
                        niños: '¡Aquí puedes ver toda la información de este súper poder!',
                        jóvenes: 'Información detallada del permiso y sus roles',
                        adultos: 'Información completa del permiso del sistema y los roles que lo tienen',
                    })}
                    editHref={`/admin/permissions/${permission.id}/edit`}
                    backHref="/admin/permissions"
                    editText={getTextByMode({
                        niños: '✏️ ¡Editar Permiso!',
                        jóvenes: 'Editar Permiso',
                        adultos: 'Editar Permiso',
                    })}
                    backText={getTextByMode({
                        niños: '⬅️ Volver a Permisos',
                        jóvenes: 'Volver a Permisos',
                        adultos: 'Volver a Permisos',
                    })}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Información básica */}
                    <div className="lg:col-span-1">
                        <InfoCard
                            title={getTextByMode({
                                niños: '📋 Info del Permiso',
                                jóvenes: 'Información del Permiso',
                                adultos: 'Información del Permiso',
                            })}
                            fields={[
                                {
                                    label: getTextByMode({
                                        niños: '🛡️ Nombre',
                                        jóvenes: 'Nombre',
                                        adultos: 'Nombre',
                                    }),
                                    value: permission.name,
                                },
                                {
                                    label: getTextByMode({
                                        niños: '🛡️ Guardia',
                                        jóvenes: 'Guard Name',
                                        adultos: 'Guard Name',
                                    }),
                                    value: permission.guard_name,
                                },
                                {
                                    label: getTextByMode({
                                        niños: '🎭 Total Roles',
                                        jóvenes: 'Total de Roles',
                                        adultos: 'Total de Roles',
                                    }),
                                    value: `${permission.roles.length} ${permission.roles.length === 1 ? 'rol' : 'roles'}`,
                                },
                                {
                                    label: getTextByMode({
                                        niños: '📅 Creado',
                                        jóvenes: 'Fecha de Creación',
                                        adultos: 'Fecha de Creación',
                                    }),
                                    value: new Date(permission.created_at).toLocaleDateString('es-CO', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    }),
                                },
                                {
                                    label: getTextByMode({
                                        niños: '📝 Actualizado',
                                        jóvenes: 'Última Actualización',
                                        adultos: 'Última Actualización',
                                    }),
                                    value: new Date(permission.updated_at).toLocaleDateString('es-CO', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    }),
                                },
                            ]}
                            columns={1}
                        />
                    </div>

                    {/* Roles que tienen este permiso */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
                                {getTextByMode({
                                    niños: '🎭 Roles con este Súper Poder',
                                    jóvenes: 'Roles con este Permiso',
                                    adultos: 'Roles que tienen este Permiso',
                                })}
                            </h3>

                            {permission.roles.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-2">😔</div>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {getTextByMode({
                                            niños: 'Ningún rol tiene este súper poder todavía',
                                            jóvenes: 'Ningún rol tiene este permiso asignado',
                                            adultos: 'No hay roles que tengan este permiso asignado',
                                        })}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {permission.roles.map((role) => (
                                        <div
                                            key={role.id}
                                            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                        {role.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {role.guard_name}
                                                    </p>
                                                </div>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                    🎭 Rol
                                                </span>
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