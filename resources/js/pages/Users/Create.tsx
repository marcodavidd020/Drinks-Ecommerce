import { FormButtons, FormPage, FormSection } from '@/components/Form';
import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function CreateUser() {
    const { settings } = useAppMode();
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        email: '',
        password: '',
        password_confirmation: '',
        celular: '',
        genero: '',
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
        <DashboardLayout
            title={getTextByMode({
                niños: '➕ ¡Crear Usuario Nuevo!',
                jóvenes: '➕ Crear Usuario',
                adultos: 'Crear Nuevo Usuario',
            })}
        >
            <Head title="Crear Usuario" />

            <FormPage
                title={getTextByMode({
                    niños: '🎉 ¡Crear Usuario Súper Genial!',
                    jóvenes: '✨ Crear Nuevo Usuario',
                    adultos: 'Crear Nuevo Usuario',
                })}
                description={getTextByMode({
                    niños: '¡Completa todos los campos para crear un usuario increíble!',
                    jóvenes: 'Completa la información para crear el nuevo usuario',
                    adultos: 'Complete la información requerida para crear el nuevo usuario',
                })}
                backHref="/users"
                backText={getTextByMode({
                    niños: '¡Volver a la lista!',
                    jóvenes: 'Volver a usuarios',
                    adultos: 'Volver a usuarios',
                })}
            >
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
                                    placeholder={getTextByMode({
                                        niños: 'Escribe tu nombre completo...',
                                        jóvenes: 'Nombre del usuario...',
                                        adultos: 'Nombre completo del usuario',
                                    })}
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
                                    placeholder={getTextByMode({
                                        niños: 'usuario@ejemplo.com',
                                        jóvenes: 'correo@ejemplo.com',
                                        adultos: 'usuario@empresa.com',
                                    })}
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
                                        niños: '🔒 Contraseña *',
                                        jóvenes: '🔒 Contraseña *',
                                        adultos: 'Contraseña *',
                                    })}
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                    placeholder={getTextByMode({
                                        niños: 'Una contraseña súper secreta...',
                                        jóvenes: 'Contraseña segura...',
                                        adultos: 'Mínimo 8 caracteres',
                                    })}
                                    required
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                            </div>

                            <div>
                                <label className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: '🔒 Confirma tu Contraseña *',
                                        jóvenes: '🔒 Confirmar Contraseña *',
                                        adultos: 'Confirmar Contraseña *',
                                    })}
                                </label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                    placeholder={getTextByMode({
                                        niños: 'Escribe la misma contraseña...',
                                        jóvenes: 'Repite la contraseña...',
                                        adultos: 'Confirme la contraseña',
                                    })}
                                    required
                                />
                                {errors.password_confirmation && <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>}
                            </div>

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
                                    <option value="user">
                                        {getTextByMode({
                                            niños: '👤 Usuario Normal',
                                            jóvenes: '👤 Usuario',
                                            adultos: 'Usuario',
                                        })}
                                    </option>
                                    <option value="employee">
                                        {getTextByMode({
                                            niños: '👷 Empleado',
                                            jóvenes: '👷 Empleado',
                                            adultos: 'Empleado',
                                        })}
                                    </option>
                                    <option value="manager">
                                        {getTextByMode({
                                            niños: '⚡ Manager',
                                            jóvenes: '⚡ Manager',
                                            adultos: 'Gerente',
                                        })}
                                    </option>
                                    <option value="admin">
                                        {getTextByMode({
                                            niños: '👑 Admin',
                                            jóvenes: '👑 Admin',
                                            adultos: 'Administrador',
                                        })}
                                    </option>
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
                                    onChange={(e) => setData('estado', e.target.value)}
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
                            niños: '💾 ¡Crear Usuario!',
                            jóvenes: '💾 Crear Usuario',
                            adultos: 'Crear Usuario',
                        })}
                        cancelHref="/users"
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
