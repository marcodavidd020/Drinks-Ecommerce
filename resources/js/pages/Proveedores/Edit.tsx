import { FormButtons, FormPage, InputField, SelectField } from '@/components/Form';
import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Proveedor {
    id: number;
    nombre: string;
    telefono?: string;
    email?: string;
    tipo: string;
    razon_social?: string;
    apellido?: string;
}

interface ProveedorEditProps {
    proveedor: Proveedor;
}

export default function ProveedorEdit({ proveedor }: ProveedorEditProps) {
    const { getTextByMode, getModeClasses } = useAppModeText();

    const { data, setData, put, processing, errors } = useForm({
        nombre: proveedor.nombre || '',
        telefono: proveedor.telefono || '',
        email: proveedor.email || '',
        tipo: proveedor.tipo || 'persona',
        razon_social: proveedor.razon_social || '',
        apellido: proveedor.apellido || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/proveedores/${proveedor.id}`);
    };

    // Mostrar u ocultar campos según el tipo de proveedor
    const isTipoEmpresa = data.tipo === 'empresa';
    const isTipoPersona = data.tipo === 'persona';

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '✏️ ¡Editar Proveedor!',
                jóvenes: '✏️ Editar Proveedor',
                adultos: 'Editar Proveedor',
            })}
        >
            <Head title={`Editar Proveedor: ${proveedor.nombre}`} />

            <FormPage
                title={getTextByMode({
                    niños: `✏️ ¡Editar ${proveedor.nombre}!`,
                    jóvenes: `✏️ Editar ${proveedor.nombre}`,
                    adultos: `Editar Proveedor: ${proveedor.nombre}`,
                })}
                description={getTextByMode({
                    niños: '¡Modifica la información del proveedor!',
                    jóvenes: 'Actualiza la información del proveedor',
                    adultos: 'Modifique la información del proveedor',
                })}
                backHref="/proveedores"
                backText={getTextByMode({
                    niños: '¡Volver a proveedores!',
                    jóvenes: 'Volver a proveedores',
                    adultos: 'Volver a proveedores',
                })}
            >
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                            <h2 className={`mb-4 text-lg font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '📝 Información Principal',
                                    jóvenes: '📝 Datos Principales',
                                    adultos: 'Información Principal',
                                })}
                            </h2>
                            <div className="space-y-4">
                                <SelectField
                                    label={getTextByMode({
                                        niños: '🏷️ ¿Qué tipo de proveedor es?',
                                        jóvenes: '🏷️ Tipo de proveedor',
                                        adultos: 'Tipo de proveedor',
                                    })}
                                    value={data.tipo}
                                    onChange={(e) => setData('tipo', e.target.value)}
                                    placeholder={getTextByMode({
                                        niños: 'Selecciona un tipo...',
                                        jóvenes: 'Selecciona el tipo',
                                        adultos: 'Seleccione un tipo',
                                    })}
                                    options={[
                                        { value: 'empresa', label: getTextByMode({
                                            niños: '🏢 Empresa o Negocio',
                                            jóvenes: '🏢 Empresa',
                                            adultos: 'Empresa',
                                        })},
                                        { value: 'persona', label: getTextByMode({
                                            niños: '👤 Persona',
                                            jóvenes: '👤 Persona Natural',
                                            adultos: 'Persona Natural',
                                        })}
                                    ]}
                                    error={errors.tipo}
                                    required
                                />

                                <InputField
                                    label={getTextByMode({
                                        niños: isTipoPersona ? '👤 Nombre' : '🏭 Nombre de la empresa',
                                        jóvenes: isTipoPersona ? '👤 Nombre' : '🏭 Nombre de la empresa',
                                        adultos: isTipoPersona ? 'Nombre' : 'Nombre de la empresa',
                                    })}
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    placeholder={getTextByMode({
                                        niños: isTipoPersona ? 'Juan' : 'Empresa ABC',
                                        jóvenes: isTipoPersona ? 'Nombre del proveedor' : 'Nombre de la empresa',
                                        adultos: isTipoPersona ? 'Nombre del proveedor' : 'Razón social de la empresa',
                                    })}
                                    error={errors.nombre}
                                    required
                                />

                                {isTipoPersona && (
                                    <InputField
                                        label={getTextByMode({
                                            niños: '👨‍👩‍👧‍👦 Apellidos',
                                            jóvenes: '👨‍👩‍👧‍👦 Apellidos',
                                            adultos: 'Apellidos',
                                        })}
                                        type="text"
                                        value={data.apellido}
                                        onChange={(e) => setData('apellido', e.target.value)}
                                        placeholder={getTextByMode({
                                            niños: 'Pérez García',
                                            jóvenes: 'Apellidos del proveedor',
                                            adultos: 'Apellidos del proveedor',
                                        })}
                                        error={errors.apellido}
                                        required
                                    />
                                )}

                                <InputField
                                    label={getTextByMode({
                                        niños: '📧 Email',
                                        jóvenes: '📧 Correo electrónico',
                                        adultos: 'Correo electrónico',
                                    })}
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder={getTextByMode({
                                        niños: 'proveedor@email.com',
                                        jóvenes: 'correo@empresa.com',
                                        adultos: 'proveedor@empresa.com',
                                    })}
                                    error={errors.email}
                                />

                                <InputField
                                    label={getTextByMode({
                                        niños: '📞 Teléfono',
                                        jóvenes: '📞 Número de teléfono',
                                        adultos: 'Número de teléfono',
                                    })}
                                    type="tel"
                                    value={data.telefono}
                                    onChange={(e) => setData('telefono', e.target.value)}
                                    placeholder={getTextByMode({
                                        niños: '3001234567',
                                        jóvenes: '300 123 4567',
                                        adultos: '+57 300 123 4567',
                                    })}
                                    error={errors.telefono}
                                />
                            </div>
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800 lg:col-span-1">
                            <h2 className={`mb-4 text-lg font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🏢 Detalles de la Empresa',
                                    jóvenes: '🏢 Datos de la Empresa',
                                    adultos: 'Detalles de la Empresa',
                                })}
                            </h2>
                            {isTipoEmpresa ? (
                                <div className="space-y-4">
                                    <InputField
                                        label={getTextByMode({
                                            niños: '🏢 Razón Social',
                                            jóvenes: '🏢 Razón Social',
                                            adultos: 'Razón Social',
                                        })}
                                        type="text"
                                        value={data.razon_social}
                                        onChange={(e) => setData('razon_social', e.target.value)}
                                        placeholder="Razón social de la empresa"
                                        error={errors.razon_social}
                                    />
                                </div>
                            ) : (
                                <div className="flex h-full items-center justify-center rounded-lg border border-dashed bg-gray-50 p-4 text-center dark:bg-gray-800/50">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {getTextByMode({
                                            niños: 'Selecciona "Empresa" para ver más opciones.',
                                            jóvenes: 'Selecciona "Empresa" para ver estos campos.',
                                            adultos: 'Estos campos solo aplican a proveedores de tipo "Empresa".',
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <FormButtons
                        isProcessing={processing}
                        submitLabel={getTextByMode({
                            niños: '💾 ¡Guardar Cambios!',
                            jóvenes: '💾 Guardar Cambios',
                            adultos: 'Guardar Cambios',
                        })}
                        cancelHref="/proveedores"
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