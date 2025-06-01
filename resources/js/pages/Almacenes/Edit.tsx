import { FormButtons, FormPage, FormSection } from '@/components/Form';
import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Almacen {
    id: number;
    nombre: string;
    descripcion?: string;
    ubicacion: string;
}

interface AlmacenEditProps {
    almacen: Almacen;
}

export default function AlmacenEdit({ almacen }: AlmacenEditProps) {
    const { settings } = useAppMode();

    const { data, setData, put, processing, errors } = useForm({
        nombre: almacen.nombre,
        descripcion: almacen.descripcion || '',
        ubicacion: almacen.ubicacion,
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
        put(`/almacenes/${almacen.id}`);
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '✏️ ¡Editar Almacén!',
                jóvenes: '✏️ Editar Almacén',
                adultos: 'Editar Almacén',
            })}
        >
            <Head title={`Editar ${almacen.nombre}`} />

            <FormPage
                title={getTextByMode({
                    niños: `✏️ ¡Editar almacén "${almacen.nombre}"!`,
                    jóvenes: `✏️ Editar almacén: ${almacen.nombre}`,
                    adultos: `Editar Almacén: ${almacen.nombre}`,
                })}
                description={getTextByMode({
                    niños: '¡Cambia la información de este almacén!',
                    jóvenes: 'Actualiza la información del almacén',
                    adultos: 'Modifique la información del almacén',
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
                    >
                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="nombre"
                                    className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}
                                >
                                    {getTextByMode({
                                        niños: '📝 Nombre del Almacén *',
                                        jóvenes: '📝 Nombre *',
                                        adultos: 'Nombre del Almacén *',
                                    })}
                                </label>
                                <input
                                    id="nombre"
                                    type="text"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                    placeholder={getTextByMode({
                                        niños: 'Ej: Almacén Central, Bodega Norte...',
                                        jóvenes: 'Nombre del almacén',
                                        adultos: 'Ingrese el nombre del almacén',
                                    })}
                                    required
                                />
                                {errors.nombre && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nombre}</p>}
                            </div>

                            <div>
                                <label
                                    htmlFor="ubicacion"
                                    className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}
                                >
                                    {getTextByMode({
                                        niños: '📍 Ubicación del Almacén *',
                                        jóvenes: '📍 Ubicación *',
                                        adultos: 'Ubicación del Almacén *',
                                    })}
                                </label>
                                <input
                                    id="ubicacion"
                                    type="text"
                                    value={data.ubicacion}
                                    onChange={(e) => setData('ubicacion', e.target.value)}
                                    className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                    placeholder={getTextByMode({
                                        niños: 'Ej: Calle 123, Ciudad, Zona Este...',
                                        jóvenes: 'Dirección o ubicación',
                                        adultos: 'Ingrese la dirección o ubicación del almacén',
                                    })}
                                    required
                                />
                                {errors.ubicacion && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.ubicacion}</p>}
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
                                        niños: 'Cuenta algo sobre este almacén...',
                                        jóvenes: 'Descripción del almacén',
                                        adultos: 'Ingrese una descripción para el almacén',
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