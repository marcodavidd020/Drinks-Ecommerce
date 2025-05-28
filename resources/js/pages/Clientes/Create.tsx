import { Head, Link, useForm } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppMode } from '@/contexts/AppModeContext';
import { FormEventHandler } from 'react';

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
            
            <div className={`max-w-4xl mx-auto ${getModeClasses()}`}>
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/clientes"
                            className={`text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium ${getModeClasses()}`}
                        >
                            ← {getTextByMode({
                                niños: '¡Volver a la lista!',
                                jóvenes: 'Volver a clientes',
                                adultos: 'Volver a clientes'
                            })}
                        </Link>
                    </div>
                    <h1 className={`text-3xl font-bold text-gray-900 dark:text-gray-100 mt-4 ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: '🎉 ¡Crear Cliente Súper Genial!',
                            jóvenes: '✨ Crear Nuevo Cliente',
                            adultos: 'Crear Nuevo Cliente'
                        })}
                    </h1>
                    <p className={`text-gray-600 dark:text-gray-400 mt-2 ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: '¡Completa todos los campos para crear un cliente increíble!',
                            jóvenes: 'Completa la información para crear el nuevo cliente',
                            adultos: 'Complete la información requerida para crear el nuevo cliente'
                        })}
                    </p>
                </div>

                {/* Formulario */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nombre */}
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

                            {/* Email */}
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

                            {/* Contraseña */}
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

                            {/* Confirmar Contraseña */}
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

                            {/* Tipo Documento */}
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
                                    <option value="CC">Cédula de Ciudadanía</option>
                                    <option value="CE">Cédula de Extranjería</option>
                                    <option value="NIT">NIT</option>
                                    <option value="TI">Tarjeta de Identidad</option>
                                    <option value="PP">Pasaporte</option>
                                </select>
                                {errors.tipo_documento && (
                                    <p className="text-red-600 text-sm mt-1">{errors.tipo_documento}</p>
                                )}
                            </div>

                            {/* NIT/Documento */}
                            <div>
                                <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: '🔢 Número de Documento *',
                                        jóvenes: '🔢 Documento *',
                                        adultos: 'Número de Documento *'
                                    })}
                                </label>
                                <input
                                    type="text"
                                    value={data.nit}
                                    onChange={(e) => setData('nit', e.target.value)}
                                    className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                    placeholder={getTextByMode({
                                        niños: '12345678',
                                        jóvenes: '12345678',
                                        adultos: '12345678-9'
                                    })}
                                    required
                                />
                                {errors.nit && (
                                    <p className="text-red-600 text-sm mt-1">{errors.nit}</p>
                                )}
                            </div>

                            {/* Teléfono */}
                            <div>
                                <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: '📱 Teléfono',
                                        jóvenes: '📱 Celular',
                                        adultos: 'Número de Teléfono'
                                    })}
                                </label>
                                <input
                                    type="tel"
                                    value={data.telefono}
                                    onChange={(e) => setData('telefono', e.target.value)}
                                    className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                    placeholder={getTextByMode({
                                        niños: '300 123 4567',
                                        jóvenes: '300 123 4567',
                                        adultos: '+57 300 123 4567'
                                    })}
                                />
                                {errors.telefono && (
                                    <p className="text-red-600 text-sm mt-1">{errors.telefono}</p>
                                )}
                            </div>

                            {/* Ciudad */}
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
                                        niños: 'Bogotá',
                                        jóvenes: 'Medellín',
                                        adultos: 'Ciudad de residencia'
                                    })}
                                />
                                {errors.ciudad && (
                                    <p className="text-red-600 text-sm mt-1">{errors.ciudad}</p>
                                )}
                            </div>
                        </div>

                        {/* Dirección - Campo completo */}
                        <div>
                            <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🏠 Dirección',
                                    jóvenes: '🏠 Dirección',
                                    adultos: 'Dirección'
                                })}
                            </label>
                            <textarea
                                value={data.direccion}
                                onChange={(e) => setData('direccion', e.target.value)}
                                rows={3}
                                className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                placeholder={getTextByMode({
                                    niños: 'Calle 123 #45-67...',
                                    jóvenes: 'Carrera 89 #12-34...',
                                    adultos: 'Dirección completa de residencia'
                                })}
                            />
                            {errors.direccion && (
                                <p className="text-red-600 text-sm mt-1">{errors.direccion}</p>
                            )}
                        </div>

                        {/* Estado */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: '⚡ ¿Está activo? *',
                                        jóvenes: '⚡ Estado *',
                                        adultos: 'Estado del Cliente *'
                                    })}
                                </label>
                                <select
                                    value={data.estado}
                                    onChange={(e) => setData('estado', e.target.value)}
                                    className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                    required
                                >
                                    <option value="activo">{getTextByMode({ niños: '✅ Activo', jóvenes: '✅ Activo', adultos: 'Activo' })}</option>
                                    <option value="inactivo">{getTextByMode({ niños: '❌ Inactivo', jóvenes: '❌ Inactivo', adultos: 'Inactivo' })}</option>
                                </select>
                                {errors.estado && (
                                    <p className="text-red-600 text-sm mt-1">{errors.estado}</p>
                                )}
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex items-center justify-end space-x-4 pt-6">
                            <Link
                                href="/clientes"
                                className={`px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors ${getModeClasses()}`}
                            >
                                {getTextByMode({
                                    niños: '❌ Cancelar',
                                    jóvenes: 'Cancelar',
                                    adultos: 'Cancelar'
                                })}
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-md font-medium transition-colors ${getModeClasses()}`}
                            >
                                {processing ? (
                                    getTextByMode({
                                        niños: '🔄 Creando...',
                                        jóvenes: 'Creando...',
                                        adultos: 'Creando...'
                                    })
                                ) : (
                                    getTextByMode({
                                        niños: '🎉 ¡Crear Cliente!',
                                        jóvenes: '✨ Crear Cliente',
                                        adultos: 'Crear Cliente'
                                    })
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
} 