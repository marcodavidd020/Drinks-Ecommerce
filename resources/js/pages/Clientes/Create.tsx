import { FormButtons, FormPage, FormSection } from '@/components/Form';
import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function CreateCliente() {
    const { settings } = useAppMode();
    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        nombre: '',
        email: '',
        password: '',
        password_confirmation: '',
        nit: '',
        tipo_documento: 'CC',
        direccion: '',
        telefono: '',
        ciudad: '',
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
        post('/clientes');
    };

    // Configuración de campos para sección personal
    const personalFields = [
        {
            type: 'text' as const,
            name: 'nombre',
            label: getTextByMode({
                niños: '📝 Nombre Completo *',
                jóvenes: '📝 Nombre Completo *',
                adultos: 'Nombre Completo *',
            }),
            value: data.nombre,
            onChange: (value: string) => setData('nombre', value),
            placeholder: getTextByMode({
                niños: 'Escribe el nombre completo...',
                jóvenes: 'Nombre del cliente...',
                adultos: 'Nombre completo del cliente',
            }),
            required: true,
            error: errors.nombre
        },
        {
            type: 'email' as const,
            name: 'email',
            label: getTextByMode({
                niños: '📧 Email *',
                jóvenes: '📧 Correo Electrónico *',
                adultos: 'Correo Electrónico *',
            }),
            value: data.email,
            onChange: (value: string) => setData('email', value),
            placeholder: getTextByMode({
                niños: 'cliente@ejemplo.com',
                jóvenes: 'correo@ejemplo.com',
                adultos: 'cliente@empresa.com',
            }),
            required: true,
            error: errors.email
        },
        {
            type: 'text' as const,
            name: 'password',
            label: getTextByMode({
                niños: '🔒 Contraseña *',
                jóvenes: '🔒 Contraseña *',
                adultos: 'Contraseña *',
            }),
            value: data.password,
            onChange: (value: string) => setData('password', value),
            placeholder: getTextByMode({
                niños: 'Una contraseña súper secreta...',
                jóvenes: 'Contraseña segura...',
                adultos: 'Mínimo 8 caracteres',
            }),
            required: true,
            error: errors.password
        },
        {
            type: 'text' as const,
            name: 'password_confirmation',
            label: getTextByMode({
                niños: '🔒 Confirma la Contraseña *',
                jóvenes: '🔒 Confirmar Contraseña *',
                adultos: 'Confirmar Contraseña *',
            }),
            value: data.password_confirmation,
            onChange: (value: string) => setData('password_confirmation', value),
            placeholder: getTextByMode({
                niños: 'Repite la contraseña...',
                jóvenes: 'Confirma la contraseña...',
                adultos: 'Confirme la contraseña',
            }),
            required: true,
            error: errors.password_confirmation
        }
    ];

    // Configuración de campos para información adicional
    const additionalFields = [
        {
            type: 'select' as const,
            name: 'tipo_documento',
            label: getTextByMode({
                niños: '🆔 Tipo de Documento *',
                jóvenes: '🆔 Tipo Documento *',
                adultos: 'Tipo de Documento *',
            }),
            value: data.tipo_documento,
            onChange: (value: string) => setData('tipo_documento', value),
            options: [
                { value: 'CC', label: getTextByMode({
                    niños: '🪪 Cédula de Ciudadanía',
                    jóvenes: 'Cédula de Ciudadanía',
                    adultos: 'Cédula de Ciudadanía',
                })},
                { value: 'CE', label: getTextByMode({
                    niños: '🌍 Cédula de Extranjería',
                    jóvenes: 'Cédula de Extranjería',
                    adultos: 'Cédula de Extranjería',
                })},
                { value: 'NIT', label: getTextByMode({
                    niños: '🏢 NIT',
                    jóvenes: 'NIT',
                    adultos: 'NIT',
                })},
                { value: 'TI', label: getTextByMode({
                    niños: '👶 Tarjeta de Identidad',
                    jóvenes: 'Tarjeta de Identidad',
                    adultos: 'Tarjeta de Identidad',
                })}
            ],
            required: true,
            error: errors.tipo_documento
        },
        {
            type: 'text' as const,
            name: 'nit',
            label: getTextByMode({
                niños: '🔢 Número de Documento *',
                jóvenes: '🔢 Número de Documento *',
                adultos: 'Número de Documento *',
            }),
            value: data.nit,
            onChange: (value: string) => setData('nit', value),
            placeholder: getTextByMode({
                niños: 'Escribe el número...',
                jóvenes: 'Número del documento',
                adultos: 'Número del documento',
            }),
            required: true,
            error: errors.nit
        },
        {
            type: 'text' as const,
            name: 'telefono',
            label: getTextByMode({
                niños: '📱 Teléfono',
                jóvenes: '📱 Teléfono',
                adultos: 'Teléfono',
            }),
            value: data.telefono,
            onChange: (value: string) => setData('telefono', value),
            placeholder: getTextByMode({
                niños: '3001234567',
                jóvenes: '3001234567',
                adultos: '300 123 4567',
            }),
            error: errors.telefono
        },
        {
            type: 'text' as const,
            name: 'ciudad',
            label: getTextByMode({
                niños: '🏙️ Ciudad',
                jóvenes: '🏙️ Ciudad',
                adultos: 'Ciudad',
            }),
            value: data.ciudad,
            onChange: (value: string) => setData('ciudad', value),
            placeholder: getTextByMode({
                niños: 'Bogotá, Medellín...',
                jóvenes: 'Ciudad de residencia',
                adultos: 'Ciudad de residencia',
            }),
            error: errors.ciudad
        },
        {
            type: 'text' as const,
            name: 'direccion',
            label: getTextByMode({
                niños: '📍 Dirección',
                jóvenes: '📍 Dirección',
                adultos: 'Dirección',
            }),
            value: data.direccion,
            onChange: (value: string) => setData('direccion', value),
            placeholder: getTextByMode({
                niños: 'Calle 123 #45-67',
                jóvenes: 'Dirección de residencia',
                adultos: 'Dirección completa',
            }),
            span: 2 as const,
            error: errors.direccion
        },
        {
            type: 'select' as const,
            name: 'estado',
            label: getTextByMode({
                niños: '✅ Estado',
                jóvenes: '✅ Estado',
                adultos: 'Estado',
            }),
            value: data.estado,
            onChange: (value: string) => setData('estado', value),
            options: [
                { value: 'activo', label: getTextByMode({
                    niños: '✅ Activo',
                    jóvenes: 'Activo',
                    adultos: 'Activo',
                })},
                { value: 'inactivo', label: getTextByMode({
                    niños: '❌ Inactivo',
                    jóvenes: 'Inactivo',
                    adultos: 'Inactivo',
                })}
            ],
            required: true,
            error: errors.estado
        }
    ];

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '➕ ¡Crear Cliente Nuevo!',
                jóvenes: '➕ Crear Cliente',
                adultos: 'Crear Nuevo Cliente',
            })}
        >
            <Head title="Crear Cliente" />

            <FormPage
                title={getTextByMode({
                    niños: '🎉 ¡Crear Cliente Súper Genial!',
                    jóvenes: '✨ Crear Nuevo Cliente',
                    adultos: 'Crear Nuevo Cliente',
                })}
                description={getTextByMode({
                    niños: '¡Completa todos los campos para crear un cliente increíble!',
                    jóvenes: 'Completa la información para crear el nuevo cliente',
                    adultos: 'Complete la información requerida para crear el nuevo cliente',
                })}
                backHref="/clientes"
                backText={getTextByMode({
                    niños: '¡Volver a la lista!',
                    jóvenes: 'Volver a clientes',
                    adultos: 'Volver a clientes',
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
                            niños: '📄 Información Adicional',
                            jóvenes: '📄 Información Complementaria',
                            adultos: 'Información Complementaria',
                        })}
                        fields={additionalFields}
                        columns={2}
                    />

                    <FormButtons
                        isProcessing={processing}
                        submitLabel={getTextByMode({
                            niños: '💾 ¡Crear Cliente!',
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
