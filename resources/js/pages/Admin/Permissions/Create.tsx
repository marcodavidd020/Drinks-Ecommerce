import { FormButtons, FormPage, InputField } from '@/components/Form';
import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface GroupedPermissions {
    [category: string]: string[];
}

interface PermissionCreateProps {
    groupedPermissions: GroupedPermissions;
}

export default function PermissionCreate({ groupedPermissions }: PermissionCreateProps) {
    const { getTextByMode, getModeClasses } = useAppModeText();
    
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/permissions');
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '🛡️ ¡Crear Nuevo Permiso!',
                jóvenes: '🛡️ Crear Nuevo Permiso',
                adultos: 'Crear Nuevo Permiso',
            })}
        >
            <Head title="Crear Permiso" />

            <FormPage
                title={getTextByMode({
                    niños: '🛡️ ¡Crear Nuevo Permiso!',
                    jóvenes: '🛡️ Crear Nuevo Permiso',
                    adultos: 'Crear Nuevo Permiso',
                })}
                description={getTextByMode({
                    niños: '¡Vamos a crear un nuevo súper poder para el sistema!',
                    jóvenes: 'Crea un nuevo permiso para el sistema',
                    adultos: 'Cree un nuevo permiso del sistema para controlar el acceso',
                })}
                backHref="/admin/permissions"
                backText={getTextByMode({
                    niños: '⬅️ Volver a Permisos',
                    jóvenes: 'Volver a Permisos',
                    adultos: 'Volver a Permisos',
                })}
            >
                <form onSubmit={submit} className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-900/20 dark:border-blue-800">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                    💡 Consejos para Permisos
                                </h3>
                                <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                                    <p>• Use nombres descriptivos y en minúsculas</p>
                                    <p>• Separe las palabras con guiones (-)</p>
                                    <p>• Siga el patrón: acción-recurso (ej: crear-usuarios, editar-productos)</p>
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
                                helpText={getTextByMode({
                                    niños: '¡Usa guiones para separar palabras como crear-usuarios!',
                                    jóvenes: 'Use guiones para separar palabras (ej: crear-usuarios)',
                                    adultos: 'Utilice guiones para separar palabras. Ejemplo: crear-usuarios',
                                })}
                            />
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                            <h2 className={`mb-4 text-lg font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '📋 Permisos del Sistema Existentes',
                                    jóvenes: '📋 Permisos Existentes',
                                    adultos: 'Permisos del Sistema Existentes',
                                })}
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Object.entries(groupedPermissions).map(([category, permissions]) => (
                                    <div key={category} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                        <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3 capitalize">
                                            {category}
                                        </h5>
                                        <div className="space-y-1">
                                            {permissions.map((permission) => (
                                                <div key={permission} className="text-sm text-gray-600 dark:text-gray-400">
                                                    • {permission}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <FormButtons
                        isProcessing={processing}
                        submitLabel={getTextByMode({
                            niños: '🛡️ ¡Crear Permiso!',
                            jóvenes: 'Crear Permiso',
                            adultos: 'Crear Permiso',
                        })}
                        cancelHref="/admin/permissions"
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