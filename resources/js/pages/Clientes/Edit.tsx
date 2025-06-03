import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { FormSection, FormButtons, FormPage } from '@/components/Form';

interface User {
    id: number;
    nombre: string;
    email: string;
    celular?: string;
}

interface Cliente {
    id: number;
    user: User;
    nit?: string;
    telefono?: string;
    fecha_nacimiento?: string;
    genero?: string;
}

interface ClienteEditProps {
    cliente: Cliente;
}

export default function ClienteEdit({ cliente }: ClienteEditProps) {
    const { settings } = useAppMode();

    const { data, setData, put, processing, errors } = useForm({
        nombre: cliente.user.nombre,
        email: cliente.user.email,
        celular: cliente.user.celular || '',
        nit: cliente.nit || '',
        telefono: cliente.telefono || '',
        fecha_nacimiento: cliente.fecha_nacimiento || '',
        genero: cliente.genero || '',
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

    const submit = (e: FormEvent) => {
        e.preventDefault();
        put(`/clientes/${cliente.id}`);
    };

    // Configuración de campos para FormSection
    const personalFields = [
        {
            type: 'text' as const,
            name: 'nombre',
            label: getTextByMode({
                niños: '😊 Nombre del amigo',
                jóvenes: '👤 Nombre completo',
                adultos: 'Nombre completo',
            }),
            value: data.nombre,
            onChange: (value: string) => setData('nombre', value),
            placeholder: getTextByMode({
                niños: 'Escribe el nombre de tu amigo...',
                jóvenes: 'Ingresa el nombre completo',
                adultos: 'Ingrese el nombre completo del cliente',
            }),
            required: true,
            error: errors.nombre
        },
        {
            type: 'email' as const,
            name: 'email',
            label: getTextByMode({
                niños: '📧 Email del amigo',
                jóvenes: '📧 Correo electrónico',
                adultos: 'Correo electrónico',
            }),
            value: data.email,
            onChange: (value: string) => setData('email', value),
            placeholder: getTextByMode({
                niños: 'email@ejemplo.com',
                jóvenes: 'correo@ejemplo.com',
                adultos: 'correo@empresa.com',
            }),
            required: true,
            error: errors.email
        },
        {
            type: 'tel' as const,
            name: 'celular',
            label: getTextByMode({
                niños: '📱 Celular del amigo',
                jóvenes: '📱 Número celular',
                adultos: 'Número celular',
            }),
            value: data.celular,
            onChange: (value: string) => setData('celular', value),
            placeholder: getTextByMode({
                niños: '📱 3001234567',
                jóvenes: '3001234567',
                adultos: '+57 300 123 4567',
            }),
            error: errors.celular
        },
        {
            type: 'text' as const,
            name: 'nit',
            label: getTextByMode({
                niños: '🆔 Documento del amigo',
                jóvenes: '🆔 NIT/Documento',
                adultos: 'NIT/Documento de identidad',
            }),
            value: data.nit,
            onChange: (value: string) => setData('nit', value),
            placeholder: getTextByMode({
                niños: '12345678',
                jóvenes: '12345678-9',
                adultos: '12345678-9 o CC 12345678',
            }),
            error: errors.nit
        }
    ];

    const contactFields = [
        {
            type: 'tel' as const,
            name: 'telefono',
            label: getTextByMode({
                niños: '📞 Teléfono fijo',
                jóvenes: '📞 Teléfono fijo',
                adultos: 'Teléfono fijo',
            }),
            value: data.telefono,
            onChange: (value: string) => setData('telefono', value),
            placeholder: getTextByMode({
                niños: '📞 6012345678',
                jóvenes: '601 234 5678',
                adultos: '(601) 234-5678',
            }),
            error: errors.telefono
        },
        {
            type: 'date' as const,
            name: 'fecha_nacimiento',
            label: getTextByMode({
                niños: '🎂 Cumpleaños del amigo',
                jóvenes: '🎂 Fecha de nacimiento',
                adultos: 'Fecha de nacimiento',
            }),
            value: data.fecha_nacimiento,
            onChange: (value: string) => setData('fecha_nacimiento', value),
            error: errors.fecha_nacimiento
        },
        {
            type: 'select' as const,
            name: 'genero',
            label: getTextByMode({
                niños: '🚻 Género del amigo',
                jóvenes: '🚻 Género',
                adultos: 'Género',
            }),
            value: data.genero,
            onChange: (value: string) => setData('genero', value),
            options: [
                { value: '', label: getTextByMode({
                    niños: '🤔 Elige una opción',
                    jóvenes: 'Seleccionar género',
                    adultos: 'Seleccione una opción',
                })},
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
            ],
            span: 2 as const,
            error: errors.genero
        }
    ];

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '✏️ Editar Amigo Cliente',
                jóvenes: '✏️ Editar Cliente',
                adultos: 'Editar Cliente',
            })}
        >
            <Head title="Editar Cliente" />

            <FormPage
                title={getTextByMode({
                    niños: `✏️ Editando a ${cliente.user.nombre}`,
                    jóvenes: `Editar Cliente: ${cliente.user.nombre}`,
                    adultos: `Editar Cliente: ${cliente.user.nombre}`,
                })}
                description={getTextByMode({
                    niños: 'Actualiza la información de tu amigo cliente',
                    jóvenes: 'Actualiza la información del cliente',
                    adultos: 'Modifique la información del cliente en el sistema',
                })}
                backHref="/clientes"
                backText={getTextByMode({
                    niños: 'Volver a la lista',
                    jóvenes: 'Volver a la lista',
                    adultos: 'Volver a la lista',
                })}
            >
                <form onSubmit={submit} className="space-y-6">
                    <FormSection
                        title={getTextByMode({
                            niños: '👤 Información Personal',
                            jóvenes: '👤 Datos Personales',
                            adultos: 'Información Personal',
                        })}
                        fields={personalFields}
                        columns={2}
                    />

                    <FormSection
                        title={getTextByMode({
                            niños: '📞 Información de Contacto',
                            jóvenes: '📞 Datos de Contacto',
                            adultos: 'Información de Contacto',
                        })}
                        fields={contactFields}
                        columns={2}
                    />

                    <FormButtons
                        cancelHref="/clientes"
                        isProcessing={processing}
                        cancelText={getTextByMode({
                            niños: '❌ Cancelar',
                            jóvenes: 'Cancelar',
                            adultos: 'Cancelar',
                        })}
                        submitText={getTextByMode({
                            niños: '💾 Guardar cambios del amigo',
                            jóvenes: '💾 Guardar cambios',
                            adultos: 'Guardar cambios',
                        })}
                        processingText={getTextByMode({
                            niños: '⏳ Guardando a tu amigo...',
                            jóvenes: '⏳ Guardando cambios...',
                            adultos: '⏳ Guardando información...',
                        })}
                    />
                </form>
            </FormPage>
        </DashboardLayout>
    );
}
