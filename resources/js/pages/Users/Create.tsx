import { Head, Link, useForm } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppMode } from '@/contexts/AppModeContext';
import { FormEventHandler } from 'react';

export default function CreateUser() {
    const { settings } = useAppMode();
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        email: '',
        password: '',
        password_confirmation: '',
        celular: '',
        role: 'user',
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
        post('/users');
    };

    return (
        <DashboardLayout title={getTextByMode({
            niños: '➕ ¡Crear Usuario Nuevo!',
            jóvenes: '➕ Crear Usuario',
            adultos: 'Crear Nuevo Usuario'
        })}>
            <Head title="Crear Usuario" />
            
            <div className={`max-w-2xl mx-auto ${getModeClasses()}`}>
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/users"
                            className={`text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 font-medium ${getModeClasses()}`}
                        >
                            ← {getTextByMode({
                                niños: '¡Volver a la lista!',
                                jóvenes: 'Volver a usuarios',
                                adultos: 'Volver a usuarios'
                            })}
                        </Link>
                    </div>
                    <h1 className={`text-3xl font-bold text-gray-900 dark:text-gray-100 mt-4 ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: '🎉 ¡Crear Usuario Súper Genial!',
                            jóvenes: '✨ Crear Nuevo Usuario',
                            adultos: 'Crear Nuevo Usuario'
                        })}
                    </h1>
                    <p className={`text-gray-600 dark:text-gray-400 mt-2 ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: '¡Completa todos los campos para crear un usuario increíble!',
                            jóvenes: 'Completa la información para crear el nuevo usuario',
                            adultos: 'Complete la información requerida para crear el nuevo usuario'
                        })}
                    </p>
                </div>

                {/* Formulario */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <form onSubmit={submit} className="space-y-6">
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
                                    niños: 'Escribe tu nombre completo...',
                                    jóvenes: 'Nombre del usuario...',
                                    adultos: 'Nombre completo del usuario'
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
                                    niños: 'usuario@ejemplo.com',
                                    jóvenes: 'correo@ejemplo.com',
                                    adultos: 'usuario@empresa.com'
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
                                    niños: '🔒 Confirma tu Contraseña *',
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
                                    niños: 'Escribe la misma contraseña...',
                                    jóvenes: 'Repite la contraseña...',
                                    adultos: 'Confirme la contraseña'
                                })}
                                required
                            />
                            {errors.password_confirmation && (
                                <p className="text-red-600 text-sm mt-1">{errors.password_confirmation}</p>
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
                                value={data.celular}
                                onChange={(e) => setData('celular', e.target.value)}
                                className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                placeholder={getTextByMode({
                                    niños: '300 123 4567',
                                    jóvenes: '300 123 4567',
                                    adultos: '+57 300 123 4567'
                                })}
                            />
                            {errors.celular && (
                                <p className="text-red-600 text-sm mt-1">{errors.celular}</p>
                            )}
                        </div>

                        {/* Rol */}
                        <div>
                            <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🎭 ¿Qué tipo de usuario es? *',
                                    jóvenes: '🎭 Rol del Usuario *',
                                    adultos: 'Rol del Usuario *'
                                })}
                            </label>
                            <select
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                required
                            >
                                <option value="user">{getTextByMode({ niños: '👤 Usuario Normal', jóvenes: '👤 Usuario', adultos: 'Usuario' })}</option>
                                <option value="employee">{getTextByMode({ niños: '👷 Empleado', jóvenes: '👷 Empleado', adultos: 'Empleado' })}</option>
                                <option value="manager">{getTextByMode({ niños: '⚡ Manager', jóvenes: '⚡ Manager', adultos: 'Gerente' })}</option>
                                <option value="admin">{getTextByMode({ niños: '👑 Admin', jóvenes: '👑 Admin', adultos: 'Administrador' })}</option>
                            </select>
                            {errors.role && (
                                <p className="text-red-600 text-sm mt-1">{errors.role}</p>
                            )}
                        </div>

                        {/* Estado */}
                        <div>
                            <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '⚡ ¿Está activo? *',
                                    jóvenes: '⚡ Estado *',
                                    adultos: 'Estado del Usuario *'
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

                        {/* Botones */}
                        <div className="flex items-center justify-end space-x-4 pt-6">
                            <Link
                                href="/users"
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
                                        niños: '🎉 ¡Crear Usuario!',
                                        jóvenes: '✨ Crear Usuario',
                                        adultos: 'Crear Usuario'
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