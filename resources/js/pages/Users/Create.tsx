import { FormButtons, FormPage, InputField, SelectField } from '@/components/Form';
import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function CreateUser() {
    const { getTextByMode, getModeClasses } = useAppModeText();
    
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
                                        niños: '🔑 Contraseña',
                                        jóvenes: '🔑 Contraseña',
                                        adultos: 'Contraseña',
                                    })}
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder={getTextByMode({
                                        niños: 'Crea una contraseña súper segura',
                                        jóvenes: 'Crea una contraseña segura',
                                        adultos: 'Ingrese una contraseña segura',
                                    })}
                                    error={errors.password}
                                    required
                                />

                                <InputField
                                    label={getTextByMode({
                                        niños: '🔑 Confirma la Contraseña',
                                        jóvenes: '🔑 Confirmar Contraseña',
                                        adultos: 'Confirmar Contraseña',
                                    })}
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder={getTextByMode({
                                        niños: 'Escribe la misma contraseña otra vez',
                                        jóvenes: 'Confirma la contraseña',
                                        adultos: 'Confirme la contraseña',
                                    })}
                                    error={errors.password_confirmation}
                                    required
                                />

                                <SelectField
                                    label={getTextByMode({
                                        niños: '👑 Rol del Usuario',
                                        jóvenes: '👑 Rol',
                                        adultos: 'Rol del Usuario',
                                    })}
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    placeholder={getTextByMode({
                                        niños: '¿Qué permisos tendrá?',
                                        jóvenes: 'Selecciona un rol',
                                        adultos: 'Seleccione el rol del usuario',
                                    })}
                                    options={[
                                        { value: 'user', label: getTextByMode({
                                            niños: '👤 Usuario Normal',
                                            jóvenes: '👤 Usuario',
                                            adultos: 'Usuario',
                                        })},
                                        { value: 'admin', label: getTextByMode({
                                            niños: '👑 Administrador',
                                            jóvenes: '👑 Admin',
                                            adultos: 'Administrador',
                                        })},
                                        { value: 'manager', label: getTextByMode({
                                            niños: '👨‍💼 Gerente',
                                            jóvenes: '👨‍💼 Manager',
                                            adultos: 'Gerente',
                                        })}
                                    ]}
                                    error={errors.role}
                                    required
                                />

                                <SelectField
                                    label={getTextByMode({
                                        niños: '✅ Estado',
                                        jóvenes: '✅ Estado del Usuario',
                                        adultos: 'Estado del Usuario',
                                    })}
                                    value={data.estado}
                                    onChange={(e) => setData('estado', e.target.value)}
                                    placeholder={getTextByMode({
                                        niños: '¿Está activo o inactivo?',
                                        jóvenes: 'Selecciona el estado',
                                        adultos: 'Seleccione el estado del usuario',
                                    })}
                                    options={[
                                        { value: 'activo', label: getTextByMode({
                                            niños: '✅ Activo',
                                            jóvenes: '✅ Activo',
                                            adultos: 'Activo',
                                        })},
                                        { value: 'inactivo', label: getTextByMode({
                                            niños: '❌ Inactivo',
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
