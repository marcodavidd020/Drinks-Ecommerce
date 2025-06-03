import { FormButtons, FormPage, InputField, SelectField, TextareaField } from '@/components/Form';
import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ProveedorCreate() {
    const { getTextByMode, getModeClasses } = useAppModeText();

    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        telefono: '',
        email: '',
        direccion: '',
        tipo: '',
        razon_social: '',
        nit: '',
        representante_legal: '',
        apellido: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/proveedores');
    };

    // Mostrar u ocultar campos según el tipo de proveedor
    const isTipoEmpresa = data.tipo === 'empresa';
    const isTipoPersona = data.tipo === 'persona';

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '➕ ¡Crear Proveedor Nuevo!',
                jóvenes: '➕ Crear Proveedor',
                adultos: 'Crear Nuevo Proveedor',
            })}
        >
            <Head title="Crear Proveedor" />

            <FormPage
                title={getTextByMode({
                    niños: '🎉 ¡Crear Proveedor Súper Genial!',
                    jóvenes: '✨ Crear Nuevo Proveedor',
                    adultos: 'Crear Nuevo Proveedor',
                })}
                description={getTextByMode({
                    niños: '¡Completa todos los campos para crear un proveedor increíble!',
                    jóvenes: 'Completa la información para crear el nuevo proveedor',
                    adultos: 'Complete la información requerida para crear el nuevo proveedor',
                })}
                backHref="/proveedores"
                backText={getTextByMode({
                    niños: '¡Volver a la lista!',
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

                                <TextareaField
                                    label={getTextByMode({
                                        niños: '📍 Dirección',
                                        jóvenes: '📍 Dirección',
                                        adultos: 'Dirección',
                                    })}
                                    value={data.direccion}
                                    onChange={(e) => setData('direccion', e.target.value)}
                                    rows={3}
                                    placeholder={getTextByMode({
                                        niños: 'Calle 123 #45-67',
                                        jóvenes: 'Dirección completa',
                                        adultos: 'Dirección completa del proveedor',
                                    })}
                                    error={errors.direccion}
                                />
                            </div>
                        </div>

                        {/* Información específica para empresas */}
                        {isTipoEmpresa && (
                            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                                <h2 className={`mb-4 text-lg font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: '🏢 Información de la Empresa',
                                        jóvenes: '🏢 Datos de la Empresa',
                                        adultos: 'Información de la Empresa',
                                    })}
                                </h2>
                                <div className="space-y-4">
                                    <InputField
                                        label={getTextByMode({
                                            niños: '🏭 Razón Social',
                                            jóvenes: '🏭 Razón Social',
                                            adultos: 'Razón Social',
                                        })}
                                        type="text"
                                        value={data.razon_social}
                                        onChange={(e) => setData('razon_social', e.target.value)}
                                        placeholder={getTextByMode({
                                            niños: 'ABC Empresa S.A.S.',
                                            jóvenes: 'Razón social oficial',
                                            adultos: 'Razón social de la empresa',
                                        })}
                                        error={errors.razon_social}
                                    />

                                    <InputField
                                        label={getTextByMode({
                                            niños: '🔢 NIT',
                                            jóvenes: '🔢 NIT',
                                            adultos: 'NIT',
                                        })}
                                        type="text"
                                        value={data.nit}
                                        onChange={(e) => setData('nit', e.target.value)}
                                        placeholder={getTextByMode({
                                            niños: '123456789-0',
                                            jóvenes: 'NIT de la empresa',
                                            adultos: 'Número de identificación tributaria',
                                        })}
                                        error={errors.nit}
                                    />

                                    <InputField
                                        label={getTextByMode({
                                            niños: '👔 Representante Legal',
                                            jóvenes: '👔 Representante Legal',
                                            adultos: 'Representante Legal',
                                        })}
                                        type="text"
                                        value={data.representante_legal}
                                        onChange={(e) => setData('representante_legal', e.target.value)}
                                        placeholder={getTextByMode({
                                            niños: 'Juan Pérez',
                                            jóvenes: 'Nombre del representante',
                                            adultos: 'Nombre completo del representante legal',
                                        })}
                                        error={errors.representante_legal}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Información específica para personas */}
                        {isTipoPersona && (
                            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                                <h2 className={`mb-4 text-lg font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: '👤 Información Personal',
                                        jóvenes: '👤 Datos Personales',
                                        adultos: 'Información Personal',
                                    })}
                                </h2>
                                <div className="space-y-4">
                                    <InputField
                                        label={getTextByMode({
                                            niños: '🆔 Número de Documento',
                                            jóvenes: '🆔 Documento de Identidad',
                                            adultos: 'Documento de Identidad',
                                        })}
                                        type="text"
                                        value={data.nit}
                                        onChange={(e) => setData('nit', e.target.value)}
                                        placeholder={getTextByMode({
                                            niños: '12345678',
                                            jóvenes: 'Cédula de ciudadanía',
                                            adultos: 'Número de cédula o documento',
                                        })}
                                        error={errors.nit}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <FormButtons
                        isProcessing={processing}
                        submitLabel={getTextByMode({
                            niños: '💾 ¡Crear Proveedor!',
                            jóvenes: '💾 Crear Proveedor',
                            adultos: 'Crear Proveedor',
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