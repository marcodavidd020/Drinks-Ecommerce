import { FormButtons, FormPage, InputField } from '@/components/Form';
import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Permission {
    id: number;
    name: string;
    label: string;
    guard_name: string;
}

interface GroupedPermissions {
    [category: string]: string[];
}

interface PermissionEditProps {
    permission: Permission;
    groupedPermissions: GroupedPermissions;
}

export default function PermissionEdit({ permission, groupedPermissions }: PermissionEditProps) {
    const { getTextByMode, getModeClasses } = useAppModeText();
    
    const { data, setData, put, processing, errors } = useForm({
        name: permission.name,
    });

    const isSystemPermission = Object.values(groupedPermissions).flat().includes(permission.name);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/admin/permissions/${permission.id}`);
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: `🛡️ ¡Editar Permiso ${permission.label}!`,
                jóvenes: `🛡️ Editar Permiso: ${permission.label}`,
                adultos: `Editar Permiso: ${permission.label}`,
            })}
        >
            <Head title={`Editar Permiso: ${permission.name}`} />

            <FormPage
                title={getTextByMode({
                    niños: `🛡️ ¡Editar Permiso ${permission.label}!`,
                    jóvenes: `🛡️ Editar Permiso: ${permission.label}`,
                    adultos: `Editar Permiso: ${permission.label}`,
                })}
                description={getTextByMode({
                    niños: isSystemPermission ? '¡Este súper poder es del sistema y no se puede cambiar!' : '¡Vamos a cambiar este súper poder!',
                    jóvenes: isSystemPermission ? 'Este es un permiso del sistema' : 'Modifica las propiedades del permiso',
                    adultos: isSystemPermission ? 'Este es un permiso del sistema y no puede modificarse' : 'Modifique las propiedades del permiso del sistema',
                })}
                backHref="/admin/permissions"
                backText={getTextByMode({
                    niños: '⬅️ Volver a Permisos',
                    jóvenes: 'Volver a Permisos',
                    adultos: 'Volver a Permisos',
                })}
            >
                <form onSubmit={submit} className="space-y-6">
                    {isSystemPermission && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 dark:bg-yellow-900/20 dark:border-yellow-800">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                        ⚠️ Permiso del Sistema
                                    </h3>
                                    <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                                        <p>Este es un permiso del sistema y no puede ser modificado para mantener la integridad del sistema.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-900/20 dark:border-blue-800">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                    💡 Información del Permiso
                                </h3>
                                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300 space-y-1">
                                    <p><strong>Nombre actual:</strong> {permission.name}</p>
                                    <p><strong>Etiqueta:</strong> {permission.label}</p>
                                    <p><strong>Guard:</strong> {permission.guard_name}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                            <h2 className={`mb-4 text-lg font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🛡️ Información del Permiso',
                                    jóvenes: '🛡️ Datos del Permiso',
                                    adultos: 'Información del Permiso',
                                })}
                            </h2>
                            
                            <InputField
                                label={getTextByMode({
                                    niños: '🛡️ Nombre del Permiso',
                                    jóvenes: 'Nombre del Permiso',
                                    adultos: 'Nombre del Permiso',
                                })}
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder={getTextByMode({
                                    niños: 'Ej: crear-usuarios',
                                    jóvenes: 'Ej: crear-usuarios',
                                    adultos: 'Ej: crear-usuarios',
                                })}
                                error={errors.name}
                                required
                                disabled={isSystemPermission}
                                helpText={getTextByMode({
                                    niños: '¡Usa guiones para separar palabras como crear-usuarios!',
                                    jóvenes: 'Use guiones para separar palabras (ej: crear-usuarios)',
                                    adultos: 'Utilice guiones para separar palabras. Ejemplo: crear-usuarios',
                                })}
                            />
                        </div>

                        {!isSystemPermission && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 dark:bg-green-900/20 dark:border-green-800">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                                            💡 Consejos para Permisos
                                        </h3>
                                        <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                                            <p>• Use nombres descriptivos y en minúsculas</p>
                                            <p>• Separe las palabras con guiones (-)</p>
                                            <p>• Siga el patrón: acción-recurso (ej: crear-usuarios, editar-productos)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <FormButtons
                        isProcessing={processing}
                        submitLabel={getTextByMode({
                            niños: '💾 ¡Guardar Cambios!',
                            jóvenes: 'Guardar Cambios',
                            adultos: 'Guardar Cambios',
                        })}
                        cancelHref="/admin/permissions"
                        cancelLabel={getTextByMode({
                            niños: '❌ Cancelar',
                            jóvenes: 'Cancelar',
                            adultos: 'Cancelar',
                        })}
                        disableSubmit={isSystemPermission}
                    />
                </form>
            </FormPage>
        </DashboardLayout>
    );
} 