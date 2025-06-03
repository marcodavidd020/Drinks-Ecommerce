import { FormButtons, FormPage, InputField, TextareaField } from '@/components/Form';
import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Categoria {
    id: number;
    nombre: string;
    descripcion?: string;
}

interface CategoriaEditProps {
    categoria: Categoria;
}

export default function CategoriaEdit({ categoria }: CategoriaEditProps) {
    const { getTextByMode, getModeClasses } = useAppModeText();

    const { data, setData, put, processing, errors } = useForm({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/categorias/${categoria.id}`);
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '✏️ ¡Editar Categoría!',
                jóvenes: '✏️ Editar Categoría',
                adultos: 'Editar Categoría',
            })}
        >
            <Head title={`Editar ${categoria.nombre}`} />

            <FormPage
                title={getTextByMode({
                    niños: `✏️ ¡Editar categoría "${categoria.nombre}"!`,
                    jóvenes: `✏️ Editar categoría: ${categoria.nombre}`,
                    adultos: `Editar Categoría: ${categoria.nombre}`,
                })}
                description={getTextByMode({
                    niños: '¡Cambia la información de esta categoría!',
                    jóvenes: 'Actualiza la información de la categoría',
                    adultos: 'Modifique la información de la categoría',
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
                            niños: '💾 ¡Guardar Cambios!',
                            jóvenes: '💾 Guardar Cambios',
                            adultos: 'Guardar Cambios',
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
