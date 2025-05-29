import { Head, useForm } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppMode } from '@/contexts/AppModeContext';
import { FormEventHandler } from 'react';
import { FormPage, FormSection, FormButtons } from '@/components/Form';

export default function CreateCliente() {
    const { settings } = useAppMode();
    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        nombre: '',
        email: '',
        password: '',
        password_confirmation: '',
        nit: '',
        tipo_documento: 'CC',
        direccion: '',
        telefono: '',
        ciudad: '',
        estado: 'activo',
    });

    const getTextByMode = (textos: { niños: string; jóvenes: string; adultos: string }) => {
        return textos[settings.ageMode as keyof typeof textos] || textos.adultos;
    };

    const getModeClasses = () => {
        switch (settings.ageMode) {
            case 'niños':
                return 'font-comic text-adaptive-kids';
            case 'jóvenes':
                return 'font-modern text-adaptive-teen';
            default:
                return 'font-classic text-adaptive-adult';
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/clientes');
    };

    return (
        <DashboardLayout title={getTextByMode({
            niños: '➕ ¡Crear Cliente Nuevo!',
            jóvenes: '➕ Crear Cliente',
            adultos: 'Crear Nuevo Cliente'
        })}>
            <Head title="Crear Cliente" />
            
            <FormPage
                title={getTextByMode({
                    niños: '🎉 ¡Crear Cliente Súper Genial!',
                    jóvenes: '✨ Crear Nuevo Cliente',
                    adultos: 'Crear Nuevo Cliente'
                })}
                description={getTextByMode({
                    niños: '¡Completa todos los campos para crear un cliente increíble!',
                    jóvenes: 'Completa la información para crear el nuevo cliente',
                    adultos: 'Complete la información requerida para crear el nuevo cliente'
                })}
                backHref="/clientes"
                backText={getTextByMode({
                    niños: '¡Volver a la lista!',
                    jóvenes: 'Volver a clientes',
                    adultos: 'Volver a clientes'
                })}
            >
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <FormSection
                            title={getTextByMode({
                                niños: '👤 Información Personal',
                                jóvenes: '👤 Datos Personales',
                                adultos: 'Información Personal'
                            })}
                        >
                            <div className="space-y-4">
                                <div>
                                    <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '📝 Nombre Completo *',
                                            jóvenes: '📝 Nombre Completo *',
                                            adultos: 'Nombre Completo *'
                                        })}
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nombre}
                                        onChange={(e) => setData('nombre', e.target.value)}
                                        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                        placeholder={getTextByMode({
                                            niños: 'Escribe el nombre completo...',
                                            jóvenes: 'Nombre del cliente...',
                                            adultos: 'Nombre completo del cliente'
                                        })}
                                        required
                                    />
                                    {errors.nombre && (
                                        <p className="text-red-600 text-sm mt-1">{errors.nombre}</p>
                                    )}
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '📧 Email *',
                                            jóvenes: '📧 Correo Electrónico *',
                                            adultos: 'Correo Electrónico *'
                                        })}
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                        placeholder={getTextByMode({
                                            niños: 'cliente@ejemplo.com',
                                            jóvenes: 'correo@ejemplo.com',
                                            adultos: 'cliente@empresa.com'
                                        })}
                                        required
                                    />
                                    {errors.email && (
                                        <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '🔒 Contraseña *',
                                            jóvenes: '🔒 Contraseña *',
                                            adultos: 'Contraseña *'
                                        })}
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                        placeholder={getTextByMode({
                                            niños: 'Una contraseña súper secreta...',
                                            jóvenes: 'Contraseña segura...',
                                            adultos: 'Mínimo 8 caracteres'
                                        })}
                                        required
                                    />
                                    {errors.password && (
                                        <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '🔒 Confirma la Contraseña *',
                                            jóvenes: '🔒 Confirmar Contraseña *',
                                            adultos: 'Confirmar Contraseña *'
                                        })}
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                        placeholder={getTextByMode({
                                            niños: 'Repite la contraseña...',
                                            jóvenes: 'Confirma la contraseña...',
                                            adultos: 'Confirme la contraseña'
                                        })}
                                        required
                                    />
                                    {errors.password_confirmation && (
                                        <p className="text-red-600 text-sm mt-1">{errors.password_confirmation}</p>
                                    )}
                                </div>
                            </div>
                        </FormSection>

                        <FormSection
                            title={getTextByMode({
                                niños: '📄 Información Adicional',
                                jóvenes: '📄 Información Complementaria',
                                adultos: 'Información Complementaria'
                            })}
                        >
                            <div className="space-y-4">
                                <div>
                                    <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '🆔 Tipo de Documento *',
                                            jóvenes: '🆔 Tipo Documento *',
                                            adultos: 'Tipo de Documento *'
                                        })}
                                    </label>
                                    <select
                                        value={data.tipo_documento}
                                        onChange={(e) => setData('tipo_documento', e.target.value)}
                                        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                        required
                                    >
                                        <option value="CC">{getTextByMode({
                                            niños: '🪪 Cédula de Ciudadanía',
                                            jóvenes: 'Cédula de Ciudadanía',
                                            adultos: 'Cédula de Ciudadanía'
                                        })}</option>
                                        <option value="CE">{getTextByMode({
                                            niños: '🪪 Cédula de Extranjería',
                                            jóvenes: 'Cédula de Extranjería',
                                            adultos: 'Cédula de Extranjería'
                                        })}</option>
                                        <option value="NIT">{getTextByMode({
                                            niños: '🏢 NIT',
                                            jóvenes: 'NIT',
                                            adultos: 'NIT'
                                        })}</option>
                                        <option value="Pasaporte">{getTextByMode({
                                            niños: '✈️ Pasaporte',
                                            jóvenes: 'Pasaporte',
                                            adultos: 'Pasaporte'
                                        })}</option>
                                    </select>
                                    {errors.tipo_documento && (
                                        <p className="text-red-600 text-sm mt-1">{errors.tipo_documento}</p>
                                    )}
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '🔢 Número de Documento *',
                                            jóvenes: '🔢 No. Documento *',
                                            adultos: 'Número de Documento *'
                                        })}
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nit}
                                        onChange={(e) => setData('nit', e.target.value)}
                                        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                        placeholder={getTextByMode({
                                            niños: 'Escribe el número aquí...',
                                            jóvenes: 'Ej: 1234567890',
                                            adultos: 'Número de identificación'
                                        })}
                                        required
                                    />
                                    {errors.nit && (
                                        <p className="text-red-600 text-sm mt-1">{errors.nit}</p>
                                    )}
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '📱 Teléfono',
                                            jóvenes: '📱 Teléfono',
                                            adultos: 'Teléfono de Contacto'
                                        })}
                                    </label>
                                    <input
                                        type="tel"
                                        value={data.telefono}
                                        onChange={(e) => setData('telefono', e.target.value)}
                                        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                        placeholder={getTextByMode({
                                            niños: 'Ej: 300 123 4567',
                                            jóvenes: '300 123 4567',
                                            adultos: 'Teléfono o celular'
                                        })}
                                    />
                                    {errors.telefono && (
                                        <p className="text-red-600 text-sm mt-1">{errors.telefono}</p>
                                    )}
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '🏙️ Ciudad',
                                            jóvenes: '🏙️ Ciudad',
                                            adultos: 'Ciudad'
                                        })}
                                    </label>
                                    <input
                                        type="text"
                                        value={data.ciudad}
                                        onChange={(e) => setData('ciudad', e.target.value)}
                                        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                        placeholder={getTextByMode({
                                            niños: '¿En qué ciudad vive?',
                                            jóvenes: 'Ciudad de residencia',
                                            adultos: 'Ciudad de residencia'
                                        })}
                                    />
                                    {errors.ciudad && (
                                        <p className="text-red-600 text-sm mt-1">{errors.ciudad}</p>
                                    )}
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '📍 Dirección',
                                            jóvenes: '📍 Dirección',
                                            adultos: 'Dirección'
                                        })}
                                    </label>
                                    <textarea
                                        value={data.direccion}
                                        onChange={(e) => setData('direccion', e.target.value)}
                                        rows={3}
                                        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                        placeholder={getTextByMode({
                                            niños: 'Escribe la dirección completa aquí...',
                                            jóvenes: 'Dirección completa',
                                            adultos: 'Dirección completa'
                                        })}
                                    />
                                    {errors.direccion && (
                                        <p className="text-red-600 text-sm mt-1">{errors.direccion}</p>
                                    )}
                                </div>
                            </div>
                        </FormSection>
                    </div>

                    <FormButtons
                        isProcessing={processing}
                        submitLabel={getTextByMode({
                            niños: '💾 ¡Crear Cliente!',
                            jóvenes: '💾 Crear Cliente',
                            adultos: 'Crear Cliente',
                        })}
                        cancelHref="/clientes"
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