import { FormSection } from '@/components/Form';
import { Button } from '@/components/ui/button';
import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

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
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        stock: inventario.stock.toString(),
    });

    const getTextByMode = (textos: { niños: string; jóvenes: string; adultos: string }) => {
        return textos[settings.ageMode as keyof typeof textos] || textos.adultos;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        put(`/inventarios/${inventario.id}`, {
            onSuccess: () => {
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
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

            <div className="space-y-6">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {getTextByMode({
                        niños: '📦 ¡Actualizar Stock!',
                        jóvenes: 'Actualizar Stock',
                        adultos: 'Actualizar Stock de Producto',
                    })}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    {getTextByMode({
                        niños: '¡Cambia la cantidad de productos en el almacén!',
                        jóvenes: 'Modifica el stock de un producto',
                        adultos: 'Actualice la cantidad disponible del producto en el inventario',
                    })}
                </p>

                <FormSection>
                    <div className="mb-6 rounded-md bg-gray-50 p-4 dark:bg-gray-800">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {getTextByMode({
                                niños: '📋 Información del Producto',
                                jóvenes: 'Información del Producto',
                                adultos: 'Información del Producto',
                            })}
                        </h3>
                        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {getTextByMode({
                                        niños: '📦 Producto',
                                        jóvenes: 'Producto',
                                        adultos: 'Producto',
                                    })}
                                </p>
                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                    {inventario.producto.nombre} ({inventario.producto.cod_producto})
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {getTextByMode({
                                        niños: '🏬 Almacén',
                                        jóvenes: 'Almacén',
                                        adultos: 'Almacén',
                                    })}
                                </p>
                                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                    {inventario.almacen.nombre} ({inventario.almacen.ubicacion})
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {getTextByMode({
                                        niños: '📊 Cantidad Actual',
                                        jóvenes: 'Stock Actual',
                                        adultos: 'Stock Actual',
                                    })}
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={data.stock}
                                    onChange={(e) => setData('stock', e.target.value)}
                                    min="0"
                                    step="1"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                                    required
                                    placeholder="Cantidad en stock"
                                />
                                {errors.stock && (
                                    <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <Button type="submit" disabled={processing || isSubmitting}>
                                {getTextByMode({
                                    niños: '💾 ¡Actualizar!',
                                    jóvenes: 'Actualizar',
                                    adultos: 'Actualizar Stock',
                                })}
                            </Button>
                        </div>
                    </form>
                </FormSection>
            </div>
        </DashboardLayout>
    );
} 