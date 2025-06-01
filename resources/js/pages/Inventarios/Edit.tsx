import { FormButtons, FormPage, FormSection } from '@/components/Form';
import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Producto {
    id: number;
    nombre: string;
    cod_producto: string;
}

interface Almacen {
    id: number;
    nombre: string;
    ubicacion: string;
}

interface ProductoInventario {
    id: number;
    producto: Producto;
    almacen: Almacen;
    stock: number;
}

interface InventariosEditProps {
    inventario: ProductoInventario;
}

export default function InventariosEdit({ inventario }: InventariosEditProps) {
    const { settings } = useAppMode();

    const { data, setData, put, processing, errors } = useForm({
        stock: inventario.stock.toString(),
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
        put(`/inventarios/${inventario.id}`);
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '📦 Actualizar Stock',
                jóvenes: 'Editar Inventario',
                adultos: 'Actualizar Stock de Producto',
            })}
        >
            <Head title="Actualizar Stock de Producto" />

            <FormPage
                title={getTextByMode({
                    niños: `📦 ¡Actualizar Stock de "${inventario.producto.nombre}"!`,
                    jóvenes: `Actualizar Stock: ${inventario.producto.nombre}`,
                    adultos: `Actualizar Stock: ${inventario.producto.nombre}`,
                })}
                description={getTextByMode({
                    niños: '¡Cambia la cantidad de productos en el almacén!',
                    jóvenes: 'Modifica el stock de un producto',
                    adultos: 'Actualice la cantidad disponible del producto en el inventario',
                })}
                backHref="/inventarios"
                backText={getTextByMode({
                    niños: '¡Volver a inventario!',
                    jóvenes: 'Volver a inventario',
                    adultos: 'Volver a inventario',
                })}
            >
                <form onSubmit={submit} className="space-y-6">
                    <FormSection
                        title={getTextByMode({
                            niños: '📋 Información del Producto',
                            jóvenes: 'Información del Producto',
                            adultos: 'Información del Producto',
                        })}
                    >
                        <div className="mb-6 rounded-md bg-gray-50 p-4 dark:bg-gray-800">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <p className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '📦 Producto',
                                            jóvenes: 'Producto',
                                            adultos: 'Producto',
                                        })}
                                    </p>
                                    <p className={`mt-1 text-sm text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                        {inventario.producto.nombre} ({inventario.producto.cod_producto})
                                    </p>
                                </div>
                                <div>
                                    <p className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '🏬 Almacén',
                                            jóvenes: 'Almacén',
                                            adultos: 'Almacén',
                                        })}
                                    </p>
                                    <p className={`mt-1 text-sm text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                        {inventario.almacen.nombre} ({inventario.almacen.ubicacion})
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label
                                    htmlFor="stock"
                                    className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}
                                >
                                    {getTextByMode({
                                        niños: '📊 Cantidad en Stock *',
                                        jóvenes: '📊 Stock *',
                                        adultos: 'Cantidad en Stock *',
                                    })}
                                </label>
                                <input
                                    id="stock"
                                    type="number"
                                    value={data.stock}
                                    onChange={(e) => setData('stock', e.target.value)}
                                    min="0"
                                    step="1"
                                    className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                    placeholder={getTextByMode({
                                        niños: 'Ej: 10, 20, 30...',
                                        jóvenes: 'Cantidad en stock',
                                        adultos: 'Ingrese la cantidad disponible',
                                    })}
                                    required
                                />
                                {errors.stock && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.stock}</p>}
                            </div>
                        </div>
                    </FormSection>

                    <FormButtons
                        isProcessing={processing}
                        submitLabel={getTextByMode({
                            niños: '💾 ¡Guardar Cambios!',
                            jóvenes: '💾 Actualizar Stock',
                            adultos: 'Guardar Cambios',
                        })}
                        cancelHref="/inventarios"
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