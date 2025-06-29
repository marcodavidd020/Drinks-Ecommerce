import { FormButtons, FormPage, InputField, SelectField } from '@/components/Form';
import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

export default function ClienteCreate() {
    const { getTextByMode, getModeClasses } = useAppModeText();

    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        email: '',
        celular: '',
        nit: '',
        password: '',
        password_confirmation: '',
        estado: 'activo',
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post('/clientes');
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '➕ ¡Crear Nuevo Amigo!',
                jóvenes: '➕ Crear Cliente',
                adultos: 'Crear Nuevo Cliente',
            })}
        >
            <Head title="Crear Cliente" />

            <FormPage
                title={getTextByMode({
                    niños: '🎉 ¡Crear un Nuevo Amigo Cliente!',
                    jóvenes: '✨ Crear Nuevo Cliente',
                    adultos: 'Crear Nuevo Cliente',
                })}
                description={getTextByMode({
                    niños: '¡Completa la información de tu nuevo amigo!',
                    jóvenes: 'Completa la información del nuevo cliente',
                    adultos: 'Complete la información del nuevo cliente en el sistema',
                })}
                backHref="/clientes"
                backText={getTextByMode({
                    niños: '¡Volver a amigos!',
                    jóvenes: 'Volver a clientes',
                    adultos: 'Volver a clientes',
                })}
            >
                <form onSubmit={submit} className="space-y-6">
                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <h2 className={`mb-4 text-lg font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '👤 Información Personal',
                                jóvenes: '👤 Datos Personales',
                                adultos: 'Información Personal',
                            })}
                        </h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <InputField
                                label={getTextByMode({
                                    niños: '😊 Nombre del amigo',
                                    jóvenes: '👤 Nombre completo',
                                    adultos: 'Nombre completo',
                                })}
                                type="text"
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                placeholder={getTextByMode({
                                    niños: 'Escribe el nombre de tu amigo...',
                                    jóvenes: 'Ingresa el nombre completo',
                                    adultos: 'Ingrese el nombre completo del cliente',
                                })}
                                error={errors.nombre}
                                required
                            />

                            <InputField
                                label={getTextByMode({
                                    niños: '📧 Email del amigo',
                                    jóvenes: '📧 Correo electrónico',
                                    adultos: 'Correo electrónico',
                                })}
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder={getTextByMode({
                                    niños: 'email@ejemplo.com',
                                    jóvenes: 'correo@ejemplo.com',
                                    adultos: 'correo@empresa.com',
                                })}
                                error={errors.email}
                                required
                            />

                            <InputField
                                label={getTextByMode({
                                    niños: '📱 Celular del amigo',
                                    jóvenes: '📱 Número celular',
                                    adultos: 'Número celular',
                                })}
                                type="tel"
                                value={data.celular}
                                onChange={(e) => setData('celular', e.target.value)}
                                placeholder={getTextByMode({
                                    niños: '📱 3001234567',
                                    jóvenes: '3001234567',
                                    adultos: '+57 300 123 4567',
                                })}
                                error={errors.celular}
                            />

                            <InputField
                                label={getTextByMode({
                                    niños: '🆔 Documento del amigo',
                                    jóvenes: '🆔 NIT/Documento',
                                    adultos: 'NIT/Documento de identidad',
                                })}
                                type="text"
                                value={data.nit}
                                onChange={(e) => setData('nit', e.target.value)}
                                placeholder={getTextByMode({
                                    niños: '12345678',
                                    jóvenes: '12345678-9',
                                    adultos: '12345678-9 o CC 12345678',
                                })}
                                error={errors.nit}
                            />
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <h2 className={`mb-4 text-lg font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '🔐 Información de Acceso',
                                jóvenes: '🔐 Datos de Acceso',
                                adultos: 'Información de Acceso',
                            })}
                        </h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <SelectField
                                label={getTextByMode({
                                    niños: '🚦 Estado del amigo',
                                    jóvenes: '🚦 Estado',
                                    adultos: 'Estado',
                                })}
                                value={data.estado}
                                onChange={(e) => setData('estado', e.target.value)}
                                options={[
                                    { value: 'activo', label: getTextByMode({
                                        niños: '🟢 Activo',
                                        jóvenes: '🟢 Activo',
                                        adultos: 'Activo',
                                    })},
                                    { value: 'inactivo', label: getTextByMode({
                                        niños: '🔴 Inactivo',
                                        jóvenes: '🔴 Inactivo',
                                        adultos: 'Inactivo',
                                    })}
                                ]}
                                error={errors.estado}
                                required
                            />

                            <InputField
                                label={getTextByMode({
                                    niños: '🔒 Contraseña del amigo',
                                    jóvenes: '🔒 Contraseña',
                                    adultos: 'Contraseña',
                                })}
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder={getTextByMode({
                                    niños: '🔒 Contraseña segura...',
                                    jóvenes: 'Contraseña segura',
                                    adultos: 'Mínimo 8 caracteres',
                                })}
                                error={errors.password}
                                required
                            />

                            <InputField
                                label={getTextByMode({
                                    niños: '🔒 Confirmar contraseña',
                                    jóvenes: '🔒 Confirmar contraseña',
                                    adultos: 'Confirmar contraseña',
                                })}
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder={getTextByMode({
                                    niños: '🔒 Repite la contraseña...',
                                    jóvenes: 'Confirma la contraseña',
                                    adultos: 'Repita la contraseña',
                                })}
                                error={errors.password_confirmation}
                                required
                            />
                        </div>
                    </div>

                    <FormButtons
                        isProcessing={processing}
                        submitLabel={getTextByMode({
                            niños: '💾 ¡Crear Amigo!',
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
