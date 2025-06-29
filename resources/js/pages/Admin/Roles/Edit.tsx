import { FormButtons, FormPage, InputField } from '@/components/Form';
import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Permission {
    id: number;
    name: string;
    guard_name: string;
}

interface Role {
    id: number;
    name: string;
    guard_name: string;
    permissions: number[];
}

interface RoleEditProps {
    role: Role;
    permissions: Permission[];
}

export default function RoleEdit({ role, permissions }: RoleEditProps) {
    const { getTextByMode, getModeClasses } = useAppModeText();
    
    const { data, setData, put, processing, errors } = useForm({
        name: role.name,
        permissions: role.permissions || [],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/admin/roles/${role.id}`);
    };

    const handlePermissionChange = (permissionId: number, checked: boolean) => {
        setData('permissions', checked
            ? [...data.permissions, permissionId]
            : data.permissions.filter(id => id !== permissionId)
        );
    };

    const isSystemRole = ['admin', 'cliente', 'empleado', 'organizador'].includes(role.name);

    // Agrupar permisos por categoría para mostrar mejor
    const groupedPermissions = permissions.reduce((acc, permission) => {
        const category = permission.name.split('-')[0] || 'otros';
        if (!acc[category]) acc[category] = [];
        acc[category].push(permission);
        return acc;
    }, {} as Record<string, Permission[]>);

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: `🎭 ¡Editar Rol ${role.name}!`,
                jóvenes: `🎭 Editar Rol: ${role.name}`,
                adultos: `Editar Rol: ${role.name}`,
            })}
        >
            <Head title={`Editar Rol: ${role.name}`} />

            <FormPage
                title={getTextByMode({
                    niños: `🎭 ¡Editar Rol ${role.name}!`,
                    jóvenes: `🎭 Editar Rol: ${role.name}`,
                    adultos: `Editar Rol: ${role.name}`,
                })}
                description={getTextByMode({
                    niños: '¡Vamos a cambiar los súper poderes de este rol!',
                    jóvenes: 'Modifica el rol y ajusta sus permisos',
                    adultos: 'Modifique las propiedades del rol y configure sus permisos',
                })}
                backHref="/admin/roles"
                backText={getTextByMode({
                    niños: '⬅️ Volver a Roles',
                    jóvenes: 'Volver a Roles',
                    adultos: 'Volver a Roles',
                })}
            >
                <form onSubmit={submit} className="space-y-6">
                    {isSystemRole && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 dark:bg-yellow-900/20 dark:border-yellow-800">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                        ⚠️ Rol del Sistema
                                    </h3>
                                    <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                                        <p>Este es un rol del sistema. El nombre no puede ser modificado, pero sí los permisos.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-6">
                        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                            <h2 className={`mb-4 text-lg font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🎭 Información del Rol',
                                    jóvenes: '🎭 Datos del Rol',
                                    adultos: 'Información del Rol',
                                })}
                            </h2>
                            
                            <InputField
                                label={getTextByMode({
                                    niños: '🎭 Nombre del Rol',
                                    jóvenes: 'Nombre del Rol',
                                    adultos: 'Nombre del Rol',
                                })}
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder={getTextByMode({
                                    niños: 'Ej: Súper héroe',
                                    jóvenes: 'Ej: moderador',
                                    adultos: 'Ej: moderador',
                                })}
                                error={errors.name}
                                required
                                disabled={isSystemRole}
                            />
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                            <h2 className={`mb-4 text-lg font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🛡️ Súper Poderes del Rol',
                                    jóvenes: '🛡️ Permisos del Rol',
                                    adultos: 'Permisos del Rol',
                                })}
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                                    <div key={category} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 capitalize">
                                            {category.replace('-', ' ')}
                                        </h4>
                                        <div className="space-y-2">
                                            {categoryPermissions.map((permission) => (
                                                <label key={permission.id} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.permissions.includes(permission.id)}
                                                        onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700"
                                                    />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                                        {permission.name.replace('-', ' ')}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {errors.permissions && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                    {errors.permissions}
                                </p>
                            )}
                        </div>
                    </div>

                    <FormButtons
                        isProcessing={processing}
                        submitLabel={getTextByMode({
                            niños: '💾 ¡Guardar Cambios!',
                            jóvenes: 'Guardar Cambios',
                            adultos: 'Guardar Cambios',
                        })}
                        cancelHref="/admin/roles"
                        cancelLabel={getTextByMode({
                            niños: '❌ Cancelar',
                            jóvenes: 'Cancelar',
                            adultos: 'Cancelar',
                        })}
                    />
                </form>
            </FormPage>
        </DashboardLayout>
    );
} 