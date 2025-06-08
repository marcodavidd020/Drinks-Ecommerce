import { FormButtons, FormPage, NumberField } from '@/components/Form';
import { useAppModeText } from '@/hooks/useAppModeText';
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
    const { getTextByMode, getModeClasses } = useAppModeText();

    const { data, setData, put, processing, errors } = useForm({
        stock: inventario.stock.toString(),
    });

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
                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <h2 className={`mb-4 text-lg font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '📋 Información del Producto',
                                jóvenes: 'Información del Producto',
                                adultos: 'Información del Producto',
                            })}
                        </h2>
                        
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
                            <NumberField
                                label={getTextByMode({
                                    niños: '📊 Cantidad en Stock',
                                    jóvenes: '📊 Stock',
                                    adultos: 'Cantidad en Stock',
                                })}
                                value={data.stock}
                                onChange={(e) => setData('stock', e.target.value)}
                                placeholder={getTextByMode({
                                    niños: 'Ej: 10, 20, 30...',
                                    jóvenes: 'Cantidad en stock',
                                    adultos: 'Ingrese la cantidad disponible',
                                })}
                                integerOnly
                                error={errors.stock}
                                required
                            />
                        </div>
                    </div>

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