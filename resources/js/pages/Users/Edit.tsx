import { FormButtons, FormPage, InputField, SelectField } from '@/components/Form';
import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
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
    const { getTextByMode, getModeClasses } = useAppModeText();
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

            <FormPage
                title={getTextByMode({
                    niños: `✏️ Editar a ${user.nombre}`,
                    jóvenes: `Editar Usuario: ${user.nombre}`,
                    adultos: `Editar Usuario: ${user.nombre}`,
                })}
                description={getTextByMode({
                    niños: '¡Modifica la información del usuario!',
                    jóvenes: 'Actualiza la información del usuario',
                    adultos: 'Modifique los datos del usuario según sea necesario',
                })}
                backHref="/users"
                backText={getTextByMode({
                    niños: '¡Volver a la lista!',
                    jóvenes: 'Volver a usuarios',
                    adultos: 'Volver a usuarios',
                })}
            >
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                                        niños: '📝 Nombre Completo',
                                        jóvenes: '📝 Nombre Completo',
                                        adultos: 'Nombre Completo',
                                    })}
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    placeholder={getTextByMode({
                                        niños: 'Escribe tu nombre completo...',
                                        jóvenes: 'Nombre del usuario...',
                                        adultos: 'Nombre completo del usuario',
                                    })}
                                    error={errors.nombre}
                                    required
                                />

                                <InputField
                                    label={getTextByMode({
                                        niños: '📧 Email',
                                        jóvenes: '📧 Correo Electrónico',
                                        adultos: 'Correo Electrónico',
                                    })}
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder={getTextByMode({
                                        niños: 'usuario@ejemplo.com',
                                        jóvenes: 'correo@ejemplo.com',
                                        adultos: 'usuario@empresa.com',
                                    })}
                                    error={errors.email}
                                    required
                                />

                                <InputField
                                    label={getTextByMode({
                                        niños: '📱 Teléfono',
                                        jóvenes: '📱 Celular',
                                        adultos: 'Número de Teléfono',
                                    })}
                                    type="tel"
                                    value={data.celular}
                                    onChange={(e) => setData('celular', e.target.value)}
                                    placeholder={getTextByMode({
                                        niños: 'Ej: 3001234567',
                                        jóvenes: 'Número de contacto',
                                        adultos: 'Ingrese el número de teléfono',
                                    })}
                                    error={errors.celular}
                                />

                                <SelectField
                                    label={getTextByMode({
                                        niños: '👩‍❤️‍👨 Género',
                                        jóvenes: '👤 Género',
                                        adultos: 'Género',
                                    })}
                                    value={data.genero}
                                    onChange={(e) => setData('genero', e.target.value)}
                                    placeholder={getTextByMode({
                                        niños: 'Selecciona una opción',
                                        jóvenes: 'Selecciona género',
                                        adultos: 'Seleccione género',
                                    })}
                                    options={[
                                        { value: 'Masculino', label: getTextByMode({
                                            niños: '👨 Masculino',
                                            jóvenes: 'Masculino',
                                            adultos: 'Masculino',
                                        })},
                                        { value: 'Femenino', label: getTextByMode({
                                            niños: '👩 Femenino',
                                            jóvenes: 'Femenino',
                                            adultos: 'Femenino',
                                        })},
                                        { value: 'No especificado', label: getTextByMode({
                                            niños: '🤷 No quiero decir',
                                            jóvenes: 'Prefiero no especificar',
                                            adultos: 'Prefiero no especificar',
                                        })}
                                    ]}
                                    error={errors.genero}
                                />
                            </div>
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                            <h2 className={`mb-4 text-lg font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🔒 Seguridad y Permisos',
                                    jóvenes: '🔒 Seguridad y Accesos',
                                    adultos: 'Seguridad y Permisos',
                                })}
                            </h2>
                            <div className="space-y-4">
                                <InputField
                                    label={getTextByMode({
                                        niños: '🔒 Nueva Contraseña (opcional)',
                                        jóvenes: '🔒 Nueva Contraseña (opcional)',
                                        adultos: 'Nueva Contraseña (opcional)',
                                    })}
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder={getTextByMode({
                                        niños: 'Deja vacío para no cambiar...',
                                        jóvenes: 'Dejar vacío para mantener actual...',
                                        adultos: 'Dejar vacío para mantener contraseña actual',
                                    })}
                                    error={errors.password}
                                />

                                {data.password && (
                                    <InputField
                                        label={getTextByMode({
                                            niños: '🔒 Confirma la Nueva Contraseña',
                                            jóvenes: '🔒 Confirmar Nueva Contraseña',
                                            adultos: 'Confirmar Nueva Contraseña',
                                        })}
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder={getTextByMode({
                                            niños: 'Repite la nueva contraseña...',
                                            jóvenes: 'Confirma la nueva contraseña...',
                                            adultos: 'Confirme la nueva contraseña',
                                        })}
                                        error={errors.password_confirmation}
                                        required
                                    />
                                )}

                                <SelectField
                                    label={getTextByMode({
                                        niños: '👑 Rol de Usuario',
                                        jóvenes: '👑 Rol del Usuario',
                                        adultos: 'Rol del Usuario',
                                    })}
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    placeholder={getTextByMode({
                                        niños: '¿Qué puede hacer este usuario?',
                                        jóvenes: 'Selecciona un rol',
                                        adultos: 'Seleccione un rol',
                                    })}
                                    options={roles.map(role => ({
                                        value: role.name,
                                        label: role.name
                                    }))}
                                    error={errors.role}
                                    required
                                />

                                <SelectField
                                    label={getTextByMode({
                                        niños: '🚦 Estado del Usuario',
                                        jóvenes: '🚦 Estado',
                                        adultos: 'Estado',
                                    })}
                                    value={data.estado}
                                    onChange={(e) => setData('estado', e.target.value as 'activo' | 'inactivo')}
                                    placeholder={getTextByMode({
                                        niños: '¿Está activo o inactivo?',
                                        jóvenes: 'Selecciona el estado',
                                        adultos: 'Seleccione el estado del usuario',
                                    })}
                                    options={[
                                        { value: 'activo', label: getTextByMode({
                                            niños: '✅ Activo - Puede usar el sistema',
                                            jóvenes: '✅ Activo',
                                            adultos: 'Activo',
                                        })},
                                        { value: 'inactivo', label: getTextByMode({
                                            niños: '❌ Inactivo - No puede usar el sistema',
                                            jóvenes: '❌ Inactivo',
                                            adultos: 'Inactivo',
                                        })}
                                    ]}
                                    error={errors.estado}
                                    required
                                />
                            </div>
                        </div>
                    </div>

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
            </FormPage>
        </DashboardLayout>
    );
}
