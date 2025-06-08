import { FormButtons, FormPage, InputField, TextareaField } from '@/components/Form';
import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function CategoriaCreate() {
    const { getTextByMode, getModeClasses } = useAppModeText();

    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        descripcion: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/categorias');
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '➕ ¡Crear Categoría Nueva!',
                jóvenes: '➕ Crear Categoría',
                adultos: 'Crear Nueva Categoría',
            })}
        >
            <Head title="Crear Categoría" />

            <FormPage
                title={getTextByMode({
                    niños: '🎉 ¡Crear Categoría Súper Genial!',
                    jóvenes: '✨ Crear Nueva Categoría',
                    adultos: 'Crear Nueva Categoría',
                })}
                description={getTextByMode({
                    niños: '¡Completa los campos para crear una categoría increíble!',
                    jóvenes: 'Completa la información para crear la nueva categoría',
                    adultos: 'Complete la información requerida para crear la nueva categoría',
                })}
                backHref="/categorias"
                backText={getTextByMode({
                    niños: '¡Volver a la lista!',
                    jóvenes: 'Volver a categorías',
                    adultos: 'Volver a categorías',
                })}
            >
                <form onSubmit={submit} className="space-y-6">
                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <h2 className={`mb-4 text-lg font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '📝 Información de la Categoría',
                                jóvenes: '📝 Datos de la Categoría',
                                adultos: 'Información de la Categoría',
                            })}
                        </h2>
                        <div className="space-y-4">
                            <InputField
                                label={getTextByMode({
                                    niños: '📝 Nombre de la Categoría',
                                    jóvenes: '📝 Nombre',
                                    adultos: 'Nombre de la Categoría',
                                })}
                                type="text"
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                placeholder={getTextByMode({
                                    niños: 'Ej: Juguetes, Electrónicos, Ropa...',
                                    jóvenes: 'Nombre de la categoría',
                                    adultos: 'Ingrese el nombre de la categoría',
                                })}
                                error={errors.nombre}
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
                                    niños: 'Cuenta algo sobre esta categoría...',
                                    jóvenes: 'Descripción de la categoría',
                                    adultos: 'Ingrese una descripción para la categoría',
                                })}
                                error={errors.descripcion}
                            />
                        </div>
                    </div>

                    <FormButtons
                        isProcessing={processing}
                        submitLabel={getTextByMode({
                            niños: '💾 ¡Crear Categoría!',
                            jóvenes: '💾 Crear Categoría',
                            adultos: 'Crear Categoría',
                        })}
                        cancelHref="/categorias"
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
