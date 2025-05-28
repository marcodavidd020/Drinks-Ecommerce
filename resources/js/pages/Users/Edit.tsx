import { Head, Link, useForm } from '@inertiajs/react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppMode } from '@/contexts/AppModeContext';
import { FormEventHandler } from 'react';

interface User {
    id: number;
    nombre: string;
    email: string;
    celular?: string;
    role: string;
    estado: 'activo' | 'inactivo';
}

interface EditUserProps {
    user: User;
}

export default function EditUser({ user }: EditUserProps) {
    const { settings } = useAppMode();
    const { data, setData, put, processing, errors } = useForm({
        nombre: user.nombre,
        email: user.email,
        password: '',
        password_confirmation: '',
        celular: user.celular || '',
        role: user.role,
        estado: user.estado,
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
        put(`/users/${user.id}`);
    };

    return (
        <DashboardLayout title={getTextByMode({
            niños: '✏️ ¡Editar Usuario!',
            jóvenes: '✏️ Editar Usuario',
            adultos: 'Editar Usuario'
        })}>
            <Head title={`Editar ${user.nombre}`} />
            
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
                            niños: `✏️ ¡Editar a ${user.nombre}!`,
                            jóvenes: `✏️ Editar ${user.nombre}`,
                            adultos: `Editar Usuario: ${user.nombre}`
                        })}
                    </h1>
                    <p className={`text-gray-600 dark:text-gray-400 mt-2 ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: '¡Modifica la información del usuario!',
                            jóvenes: 'Actualiza la información del usuario',
                            adultos: 'Modifique los datos del usuario según sea necesario'
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
                                required
                            />
                            {errors.email && (
                                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Nueva Contraseña */}
                        <div>
                            <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🔒 Nueva Contraseña (opcional)',
                                    jóvenes: '🔒 Nueva Contraseña (opcional)',
                                    adultos: 'Nueva Contraseña (opcional)'
                                })}
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                placeholder={getTextByMode({
                                    niños: 'Deja vacío para no cambiar...',
                                    jóvenes: 'Dejar vacío para mantener actual...',
                                    adultos: 'Dejar vacío para mantener contraseña actual'
                                })}
                            />
                            {errors.password && (
                                <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirmar Nueva Contraseña */}
                        {data.password && (
                            <div>
                                <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: '🔒 Confirma la Nueva Contraseña *',
                                        jóvenes: '🔒 Confirmar Nueva Contraseña *',
                                        adultos: 'Confirmar Nueva Contraseña *'
                                    })}
                                </label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                    placeholder={getTextByMode({
                                        niños: 'Repite la nueva contraseña...',
                                        jóvenes: 'Confirma la nueva contraseña...',
                                        adultos: 'Confirme la nueva contraseña'
                                    })}
                                    required
                                />
                                {errors.password_confirmation && (
                                    <p className="text-red-600 text-sm mt-1">{errors.password_confirmation}</p>
                                )}
                            </div>
                        )}

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
                                        niños: '🔄 Guardando...',
                                        jóvenes: 'Guardando...',
                                        adultos: 'Guardando...'
                                    })
                                ) : (
                                    getTextByMode({
                                        niños: '💾 ¡Guardar Cambios!',
                                        jóvenes: '💾 Guardar Cambios',
                                        adultos: 'Guardar Cambios'
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