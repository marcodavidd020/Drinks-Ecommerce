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
        telefono: '',
        fecha_nacimiento: '',
        genero: '',
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
                                niños: '📞 Información de Contacto',
                                jóvenes: '📞 Información Adicional',
                                adultos: 'Información Adicional',
                            })}
                        </h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <InputField
                                label={getTextByMode({
                                    niños: '📞 Teléfono fijo',
                                    jóvenes: '📞 Teléfono fijo',
                                    adultos: 'Teléfono fijo',
                                })}
                                type="tel"
                                value={data.telefono}
                                onChange={(e) => setData('telefono', e.target.value)}
                                placeholder={getTextByMode({
                                    niños: '📞 6012345678',
                                    jóvenes: '601 234 5678',
                                    adultos: '(601) 234-5678',
                                })}
                                error={errors.telefono}
                            />

                            <InputField
                                label={getTextByMode({
                                    niños: '🎂 Cumpleaños del amigo',
                                    jóvenes: '🎂 Fecha de nacimiento',
                                    adultos: 'Fecha de nacimiento',
                                })}
                                type="date"
                                value={data.fecha_nacimiento}
                                onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                                error={errors.fecha_nacimiento}
                            />

                            <SelectField
                                label={getTextByMode({
                                    niños: '🚻 Género del amigo',
                                    jóvenes: '🚻 Género',
                                    adultos: 'Género',
                                })}
                                value={data.genero}
                                onChange={(e) => setData('genero', e.target.value)}
                                placeholder={getTextByMode({
                                    niños: '🤔 Elige una opción',
                                    jóvenes: 'Seleccionar género',
                                    adultos: 'Seleccione una opción',
                                })}
                                options={[
                                    { value: 'masculino', label: getTextByMode({
                                        niños: '👨 Niño',
                                        jóvenes: '👨 Masculino',
                                        adultos: 'Masculino',
                                    })},
                                    { value: 'femenino', label: getTextByMode({
                                        niños: '👩 Niña',
                                        jóvenes: '👩 Femenino',
                                        adultos: 'Femenino',
                                    })},
                                    { value: 'otro', label: getTextByMode({
                                        niños: '🧑 Otro',
                                        jóvenes: '🧑 Otro',
                                        adultos: 'Otro',
                                    })}
                                ]}
                                containerClassName="sm:col-span-2"
                                error={errors.genero}
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
