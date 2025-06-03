import { FormButtons, FormPage, FormSection } from '@/components/Form';
import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function AlmacenCreate() {
    const { settings } = useAppMode();

    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        descripcion: '',
        ubicacion: '',
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
        post('/almacenes');
    };

    // Configuración de campos para FormSection
    const almacenFields = [
        {
            type: 'text' as const,
            name: 'nombre',
            label: getTextByMode({
                niños: '📝 Nombre del Almacén *',
                jóvenes: '📝 Nombre *',
                adultos: 'Nombre del Almacén *',
            }),
            value: data.nombre,
            onChange: (value: string) => setData('nombre', value),
            placeholder: getTextByMode({
                niños: 'Ej: Almacén Central, Bodega Norte...',
                jóvenes: 'Nombre del almacén',
                adultos: 'Ingrese el nombre del almacén',
            }),
            required: true,
            error: errors.nombre
        },
        {
            type: 'text' as const,
            name: 'ubicacion',
            label: getTextByMode({
                niños: '📍 Ubicación del Almacén *',
                jóvenes: '📍 Ubicación *',
                adultos: 'Ubicación del Almacén *',
            }),
            value: data.ubicacion,
            onChange: (value: string) => setData('ubicacion', value),
            placeholder: getTextByMode({
                niños: 'Ej: Calle 123, Ciudad, Zona Este...',
                jóvenes: 'Dirección o ubicación',
                adultos: 'Ingrese la dirección o ubicación del almacén',
            }),
            required: true,
            error: errors.ubicacion
        },
        {
            type: 'textarea' as const,
            name: 'descripcion',
            label: getTextByMode({
                niños: '📝 Descripción',
                jóvenes: '📝 Descripción',
                adultos: 'Descripción',
            }),
            value: data.descripcion,
            onChange: (value: string) => setData('descripcion', value),
            placeholder: getTextByMode({
                niños: 'Cuenta algo sobre este almacén...',
                jóvenes: 'Descripción del almacén',
                adultos: 'Ingrese una descripción para el almacén',
            }),
            rows: 4,
            span: 2 as const,
            error: errors.descripcion
        }
    ];

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '➕ ¡Crear Almacén Nuevo!',
                jóvenes: '➕ Crear Almacén',
                adultos: 'Crear Nuevo Almacén',
            })}
        >
            <Head title="Crear Almacén" />

            <FormPage
                title={getTextByMode({
                    niños: '🏬 ¡Crear Almacén Súper Genial!',
                    jóvenes: '✨ Crear Nuevo Almacén',
                    adultos: 'Crear Nuevo Almacén',
                })}
                description={getTextByMode({
                    niños: '¡Completa los campos para crear un almacén increíble!',
                    jóvenes: 'Completa la información para crear el nuevo almacén',
                    adultos: 'Complete la información requerida para crear el nuevo almacén',
                })}
                backHref="/almacenes"
                backText={getTextByMode({
                    niños: '¡Volver a la lista!',
                    jóvenes: 'Volver a almacenes',
                    adultos: 'Volver a almacenes',
                })}
            >
                <form onSubmit={submit} className="space-y-6">
                    <FormSection
                        title={getTextByMode({
                            niños: '📝 Información del Almacén',
                            jóvenes: '📝 Datos del Almacén',
                            adultos: 'Información del Almacén',
                        })}
                        fields={almacenFields}
                        columns={2}
                    />

                    <FormButtons
                        isProcessing={processing}
                        submitLabel={getTextByMode({
                            niños: '💾 ¡Crear Almacén!',
                            jóvenes: '💾 Crear Almacén',
                            adultos: 'Crear Almacén',
                        })}
                        cancelHref="/almacenes"
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