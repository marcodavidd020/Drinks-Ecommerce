import { FormButtons, FormPage, InputField, TextareaField } from '@/components/Form';
import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function AlmacenCreate() {
    const { getTextByMode, getModeClasses } = useAppModeText();

    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        descripcion: '',
        ubicacion: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/almacenes');
    };

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
                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <h2 className={`mb-4 text-lg font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '📝 Información del Almacén',
                                jóvenes: '📝 Datos del Almacén',
                                adultos: 'Información del Almacén',
                            })}
                        </h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <InputField
                                label={getTextByMode({
                                    niños: '📝 Nombre del Almacén',
                                    jóvenes: '📝 Nombre',
                                    adultos: 'Nombre del Almacén',
                                })}
                                type="text"
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                placeholder={getTextByMode({
                                    niños: 'Ej: Almacén Central, Bodega Norte...',
                                    jóvenes: 'Nombre del almacén',
                                    adultos: 'Ingrese el nombre del almacén',
                                })}
                                error={errors.nombre}
                                required
                            />

                            <InputField
                                label={getTextByMode({
                                    niños: '📍 Ubicación del Almacén',
                                    jóvenes: '📍 Ubicación',
                                    adultos: 'Ubicación del Almacén',
                                })}
                                type="text"
                                value={data.ubicacion}
                                onChange={(e) => setData('ubicacion', e.target.value)}
                                placeholder={getTextByMode({
                                    niños: 'Ej: Calle 123, Ciudad, Zona Este...',
                                    jóvenes: 'Dirección o ubicación',
                                    adultos: 'Ingrese la dirección o ubicación del almacén',
                                })}
                                error={errors.ubicacion}
                                required
                            />

                            <TextareaField
                                label={getTextByMode({
                                    niños: '📝 Descripción',
                                    jóvenes: '📝 Descripción',
                                    adultos: 'Descripción',
                                })}
                                value={data.descripcion}
                                onChange={(e) => setData('descripcion', e.target.value)}
                                rows={4}
                                placeholder={getTextByMode({
                                    niños: 'Cuenta algo sobre este almacén...',
                                    jóvenes: 'Descripción del almacén',
                                    adultos: 'Ingrese una descripción para el almacén',
                                })}
                                error={errors.descripcion}
                                containerClassName="sm:col-span-2"
                            />
                        </div>
                    </div>

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
