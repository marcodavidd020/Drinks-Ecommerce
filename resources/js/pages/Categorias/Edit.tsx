import { FormButtons, FormPage, FormSection } from '@/components/Form';
import { useAppMode } from '@/contexts/AppModeContext';
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
    const { settings } = useAppMode();

    const { data, setData, put, processing, errors } = useForm({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || '',
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
                    <FormSection
                        title={getTextByMode({
                            niños: '📝 Información de la Categoría',
                            jóvenes: '📝 Datos de la Categoría',
                            adultos: 'Información de la Categoría',
                        })}
                    >
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="nombre"
                                    className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}
                                >
                                    {getTextByMode({
                                        niños: '📝 Nombre de la Categoría *',
                                        jóvenes: '📝 Nombre *',
                                        adultos: 'Nombre de la Categoría *',
                                    })}
                                </label>
                                <input
                                    id="nombre"
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                    placeholder={getTextByMode({
                                        niños: 'Ej: Juguetes, Electrónicos, Ropa...',
                                        jóvenes: 'Nombre de la categoría',
                                        adultos: 'Ingrese el nombre de la categoría',
                                    })}
                                    required
                                />
                                {errors.nombre && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nombre}</p>}
                            </div>

                            <div>
                                <label
                                    htmlFor="descripcion"
                                    className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}
                                >
                                    {getTextByMode({
                                        niños: '📝 Descripción',
                                        jóvenes: '📝 Descripción',
                                        adultos: 'Descripción',
                                    })}
                                </label>
                                <textarea
                                    id="descripcion"
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    rows={4}
                                    className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                    placeholder={getTextByMode({
                                        niños: 'Cuenta algo sobre esta categoría...',
                                        jóvenes: 'Descripción de la categoría',
                                        adultos: 'Ingrese una descripción para la categoría',
                                    })}
                                ></textarea>
                                {errors.descripcion && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.descripcion}</p>}
                            </div>
                        </div>
                    </FormSection>

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
