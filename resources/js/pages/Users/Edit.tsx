import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { FormSection, FormButtons } from '@/components/Form';

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
                    <h1 className={`mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: `✏️ Editar a ${user.nombre}`,
                            jóvenes: `Editar Usuario: ${user.nombre}`,
                            adultos: `Editar Usuario: ${user.nombre}`,
                        })}
                    </h1>
                    <p className={`mt-2 text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: '¡Modifica la información del usuario!',
                            jóvenes: 'Actualiza la información del usuario',
                            adultos: 'Modifique los datos del usuario según sea necesario',
                        })}
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <FormSection
                        title={getTextByMode({
                            niños: '👤 Información Personal',
                            jóvenes: '👤 Datos Personales',
                            adultos: 'Información Personal',
                        })}
                    >
                        <div className="space-y-4">
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
                                        niños: 'Ej: 3001234567',
                                        jóvenes: 'Número de contacto',
                                        adultos: 'Ingrese el número de teléfono',
                                    })}
                                />
                                {errors.celular && <p className="mt-1 text-sm text-red-600">{errors.celular}</p>}
                            </div>

                            <div>
                                <label className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: '👩‍❤️‍👨 Género',
                                        jóvenes: '👤 Género',
                                        adultos: 'Género',
                                    })}
                                </label>
                                <select
                                    value={data.genero}
                                    onChange={(e) => setData('genero', e.target.value)}
                                    className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                >
                                    <option value="">
                                        {getTextByMode({
                                            niños: 'Selecciona una opción',
                                            jóvenes: 'Selecciona género',
                                            adultos: 'Seleccione género',
                                        })}
                                    </option>
                                    <option value="Masculino">
                                        {getTextByMode({
                                            niños: '👨 Masculino',
                                            jóvenes: 'Masculino',
                                            adultos: 'Masculino',
                                        })}
                                    </option>
                                    <option value="Femenino">
                                        {getTextByMode({
                                            niños: '👩 Femenino',
                                            jóvenes: 'Femenino',
                                            adultos: 'Femenino',
                                        })}
                                    </option>
                                    <option value="No especificado">
                                        {getTextByMode({
                                            niños: '🤷 No quiero decir',
                                            jóvenes: 'Prefiero no especificar',
                                            adultos: 'Prefiero no especificar',
                                        })}
                                    </option>
                                </select>
                                {errors.genero && <p className="mt-1 text-sm text-red-600">{errors.genero}</p>}
                            </div>
                        </div>
                    </FormSection>

                    <FormSection
                        title={getTextByMode({
                            niños: '🔒 Seguridad y Permisos',
                            jóvenes: '🔒 Seguridad y Accesos',
                            adultos: 'Seguridad y Permisos',
                        })}
                    >
                        <div className="space-y-4">
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

                            <div>
                                <label className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: '👑 Rol de Usuario *',
                                        jóvenes: '👑 Rol del Usuario *',
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
                                        {getTextByMode({
                                            niños: '¿Qué puede hacer este usuario?',
                                            jóvenes: 'Selecciona un rol',
                                            adultos: 'Seleccione un rol',
                                        })}
                                    </option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.name}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
                            </div>

                            <div>
                                <label className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: '🚦 Estado del Usuario *',
                                        jóvenes: '🚦 Estado *',
                                        adultos: 'Estado *',
                                    })}
                                </label>
                                <select
                                    value={data.estado}
                                    onChange={(e) => setData('estado', e.target.value as 'activo' | 'inactivo')}
                                    className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                    required
                                >
                                    <option value="activo">
                                        {getTextByMode({
                                            niños: '✅ Activo - Puede usar el sistema',
                                            jóvenes: '✅ Activo',
                                            adultos: 'Activo',
                                        })}
                                    </option>
                                    <option value="inactivo">
                                        {getTextByMode({
                                            niños: '❌ Inactivo - No puede usar el sistema',
                                            jóvenes: '❌ Inactivo',
                                            adultos: 'Inactivo',
                                        })}
                                    </option>
                                </select>
                                {errors.estado && <p className="mt-1 text-sm text-red-600">{errors.estado}</p>}
                            </div>
                        </div>
                    </FormSection>

                    <FormButtons
                        isProcessing={processing}
                        submitLabel={getTextByMode({
                            niños: '💾 ¡Guardar Cambios!',
                            jóvenes: '💾 Guardar Cambios',
                            adultos: 'Guardar Cambios',
                        })}
                        cancelHref="/users"
                        cancelLabel={getTextByMode({
                            niños: '❌ Cancelar',
                            jóvenes: 'Cancelar',
                            adultos: 'Cancelar',
                        })}
                    />
                </form>
            </div>
        </DashboardLayout>
    );
}
