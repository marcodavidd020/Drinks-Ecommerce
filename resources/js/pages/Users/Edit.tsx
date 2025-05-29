import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface User {
    id: number;
    nombre: string;
    email: string;
    celular?: string;
    genero?: string;
    role?: string;
    estado: 'activo' | 'inactivo';
    roles?: Array<{ id: number; name: string }>;
}

interface Role {
    id: number;
    name: string;
}

interface EditUserProps {
    user: User;
    roles: Role[];
    currentRole?: string;
}

export default function EditUser({ user, roles, currentRole }: EditUserProps) {
    const { settings } = useAppMode();
    const { data, setData, put, processing, errors } = useForm({
        nombre: user.nombre,
        email: user.email,
        password: '',
        password_confirmation: '',
        celular: user.celular || '',
        genero: user.genero || '',
        role: currentRole || user.roles?.[0]?.name || '',
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
        <DashboardLayout
            title={getTextByMode({
                niños: '✏️ ¡Editar Usuario!',
                jóvenes: '✏️ Editar Usuario',
                adultos: 'Editar Usuario',
            })}
        >
            <Head title={`Editar ${user.nombre}`} />

            <div className={`mx-auto max-w-2xl ${getModeClasses()}`}>
                {/* Header con navegación */}
                <div className="mb-6">
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/users"
                            className={`font-medium text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 ${getModeClasses()}`}
                        >
                            ←{' '}
                            {getTextByMode({
                                niños: '¡Volver a la lista!',
                                jóvenes: 'Volver a usuarios',
                                adultos: 'Volver a usuarios',
                            })}
                        </Link>
                    </div>
                    <p className={`mt-2 text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: '¡Modifica la información del usuario!',
                            jóvenes: 'Actualiza la información del usuario',
                            adultos: 'Modifique los datos del usuario según sea necesario',
                        })}
                    </p>
                </div>

                {/* Formulario */}
                <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Nombre */}
                        <div>
                            <label className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '📝 Nombre Completo *',
                                    jóvenes: '📝 Nombre Completo *',
                                    adultos: 'Nombre Completo *',
                                })}
                            </label>
                            <input
                                type="text"
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                required
                            />
                            {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '📧 Email *',
                                    jóvenes: '📧 Correo Electrónico *',
                                    adultos: 'Correo Electrónico *',
                                })}
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                required
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        {/* Nueva Contraseña */}
                        <div>
                            <label className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🔒 Nueva Contraseña (opcional)',
                                    jóvenes: '🔒 Nueva Contraseña (opcional)',
                                    adultos: 'Nueva Contraseña (opcional)',
                                })}
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                placeholder={getTextByMode({
                                    niños: 'Deja vacío para no cambiar...',
                                    jóvenes: 'Dejar vacío para mantener actual...',
                                    adultos: 'Dejar vacío para mantener contraseña actual',
                                })}
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>

                        {/* Confirmar Nueva Contraseña */}
                        {data.password && (
                            <div>
                                <label className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: '🔒 Confirma la Nueva Contraseña *',
                                        jóvenes: '🔒 Confirmar Nueva Contraseña *',
                                        adultos: 'Confirmar Nueva Contraseña *',
                                    })}
                                </label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                    placeholder={getTextByMode({
                                        niños: 'Repite la nueva contraseña...',
                                        jóvenes: 'Confirma la nueva contraseña...',
                                        adultos: 'Confirme la nueva contraseña',
                                    })}
                                    required
                                />
                                {errors.password_confirmation && <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>}
                            </div>
                        )}

                        {/* Teléfono */}
                        <div>
                            <label className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '📱 Teléfono',
                                    jóvenes: '📱 Celular',
                                    adultos: 'Número de Teléfono',
                                })}
                            </label>
                            <input
                                type="tel"
                                value={data.celular}
                                onChange={(e) => setData('celular', e.target.value)}
                                className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                placeholder={getTextByMode({
                                    niños: '300 123 4567',
                                    jóvenes: '300 123 4567',
                                    adultos: '+57 300 123 4567',
                                })}
                            />
                            {errors.celular && <p className="mt-1 text-sm text-red-600">{errors.celular}</p>}
                        </div>

                        {/* Género */}
                        <div>
                            <label className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🧑‍🤝‍🧑 Género',
                                    jóvenes: '🧑‍🤝‍🧑 Género',
                                    adultos: 'Género',
                                })}
                            </label>
                            <select
                                value={data.genero}
                                onChange={(e) => setData('genero', e.target.value)}
                                className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                            >
                                <option value="">
                                    {getTextByMode({ niños: 'Seleccionar...', jóvenes: 'Seleccionar...', adultos: 'No especificado' })}
                                </option>
                                <option value="masculino">
                                    {getTextByMode({ niños: '👨 Masculino', jóvenes: '👨 Masculino', adultos: 'Masculino' })}
                                </option>
                                <option value="femenino">
                                    {getTextByMode({ niños: '👩 Femenino', jóvenes: '👩 Femenino', adultos: 'Femenino' })}
                                </option>
                                <option value="otro">{getTextByMode({ niños: '🧑 Otro', jóvenes: '🧑 Otro', adultos: 'Otro' })}</option>
                            </select>
                            {errors.genero && <p className="mt-1 text-sm text-red-600">{errors.genero}</p>}
                        </div>

                        {/* Rol */}
                        <div>
                            <label className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🎭 ¿Qué tipo de usuario es? *',
                                    jóvenes: '🎭 Rol del Usuario *',
                                    adultos: 'Rol del Usuario *',
                                })}
                            </label>
                            <select
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                required
                            >
                                <option value="">
                                    {getTextByMode({ niños: 'Selecciona un rol...', jóvenes: 'Seleccionar rol...', adultos: 'Seleccionar rol' })}
                                </option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.name}>
                                        {getTextByMode({
                                            niños:
                                                role.name === 'cliente'
                                                    ? '👤 Cliente'
                                                    : role.name === 'empleado'
                                                      ? '👷 Empleado'
                                                      : role.name === 'admin'
                                                        ? '👑 Admin'
                                                        : role.name === 'super-admin'
                                                          ? '🦸 Super Admin'
                                                          : role.name,
                                            jóvenes:
                                                role.name === 'cliente'
                                                    ? '👤 Cliente'
                                                    : role.name === 'empleado'
                                                      ? '👷 Empleado'
                                                      : role.name === 'admin'
                                                        ? '👑 Admin'
                                                        : role.name === 'super-admin'
                                                          ? '🦸 Super Admin'
                                                          : role.name,
                                            adultos:
                                                role.name === 'cliente'
                                                    ? 'Cliente'
                                                    : role.name === 'empleado'
                                                      ? 'Empleado'
                                                      : role.name === 'admin'
                                                        ? 'Administrador'
                                                        : role.name === 'super-admin'
                                                          ? 'Super Administrador'
                                                          : role.name,
                                        })}
                                    </option>
                                ))}
                            </select>
                            {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
                        </div>

                        {/* Estado */}
                        <div>
                            <label className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '⚡ ¿Está activo? *',
                                    jóvenes: '⚡ Estado *',
                                    adultos: 'Estado del Usuario *',
                                })}
                            </label>
                            <select
                                value={data.estado}
                                onChange={(e) => setData('estado', e.target.value as 'activo' | 'inactivo')}
                                className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                required
                            >
                                <option value="activo">{getTextByMode({ niños: '⚡ Activo', jóvenes: '⚡ Activo', adultos: 'Activo' })}</option>
                                <option value="inactivo">
                                    {getTextByMode({ niños: '⚡ Inactivo', jóvenes: '⚡ Inactivo', adultos: 'Inactivo' })}
                                </option>
                            </select>
                            {errors.estado && <p className="mt-1 text-sm text-red-600">{errors.estado}</p>}
                        </div>

                        {/* Botones */}
                        <div className="flex items-center justify-end space-x-4 pt-6">
                            <Link
                                href="/users"
                                className={`rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 ${getModeClasses()}`}
                            >
                                {getTextByMode({
                                    niños: '❌ Cancelar',
                                    jóvenes: 'Cancelar',
                                    adultos: 'Cancelar',
                                })}
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className={`rounded-md bg-purple-600 px-6 py-2 font-medium text-white transition-colors hover:bg-purple-700 disabled:bg-purple-400 ${getModeClasses()}`}
                            >
                                {processing
                                    ? getTextByMode({
                                          niños: '🔄 Guardando...',
                                          jóvenes: 'Guardando...',
                                          adultos: 'Guardando...',
                                      })
                                    : getTextByMode({
                                          niños: '💾 ¡Guardar Cambios!',
                                          jóvenes: '💾 Guardar Cambios',
                                          adultos: 'Guardar Cambios',
                                      })}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
