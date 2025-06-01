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
    precio_venta: number;
}

interface Almacen {
    id: number;
    nombre: string;
    ubicacion: string;
}

interface InventariosCreateProps {
    productos: Producto[];
    almacenes: Almacen[];
}

export default function InventariosCreate({ productos, almacenes }: InventariosCreateProps) {
    const { settings } = useAppMode();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        producto_id: '',
        almacen_id: '',
        stock: '',
    });

    const getTextByMode = (textos: { niños: string; jóvenes: string; adultos: string }) => {
        return textos[settings.ageMode as keyof typeof textos] || textos.adultos;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        post('/inventarios', {
            onSuccess: () => {
                reset('producto_id', 'almacen_id', 'stock');
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    };

    const productoOptions = [
        { value: '', label: '-- Seleccione un producto --' },
        ...productos.map((producto) => ({
            value: producto.id.toString(),
            label: `${producto.nombre} (${producto.cod_producto})`,
        })),
    ];

    const almacenOptions = [
        { value: '', label: '-- Seleccione un almacén --' },
        ...almacenes.map((almacen) => ({
            value: almacen.id.toString(),
            label: `${almacen.nombre} (${almacen.ubicacion})`,
        })),
    ];

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '📦 Agregar Producto al Inventario',
                jóvenes: 'Agregar al Inventario',
                adultos: 'Registrar Producto en Inventario',
            })}
        >
            <Head title="Agregar Producto al Inventario" />

            <div className="space-y-6">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {getTextByMode({
                        niños: '📦 ¡Agregar un Producto al Inventario!',
                        jóvenes: 'Agregar Producto al Inventario',
                        adultos: 'Registrar Producto en Inventario',
                    })}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    {getTextByMode({
                        niños: '¡Aquí puedes añadir un producto a un almacén!',
                        jóvenes: 'Agrega un producto al inventario de un almacén',
                        adultos: 'Complete el formulario para registrar un producto en el inventario',
                    })}
                </p>

                <FormSection>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {getTextByMode({
                                        niños: '📦 Producto',
                                        jóvenes: 'Producto',
                                        adultos: 'Producto',
                                    })}
                                </label>
                                <select
                                    name="producto_id"
                                    value={data.producto_id}
                                    onChange={(e) => setData('producto_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                                    required
                                >
                                    {productoOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                                {errors.producto_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.producto_id}</p>
                                )}
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {getTextByMode({
                                        niños: '🏬 Almacén',
                                        jóvenes: 'Almacén',
                                        adultos: 'Almacén',
                                    })}
                                </label>
                                <select
                                    name="almacen_id"
                                    value={data.almacen_id}
                                    onChange={(e) => setData('almacen_id', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                                    required
                                >
                                    {almacenOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                                {errors.almacen_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.almacen_id}</p>
                                )}
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {getTextByMode({
                                        niños: '📊 Cantidad',
                                        jóvenes: 'Stock',
                                        adultos: 'Stock Inicial',
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
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => reset('producto_id', 'almacen_id', 'stock')}
                                disabled={processing || isSubmitting}
                            >
                                {getTextByMode({
                                    niños: '🧹 Limpiar',
                                    jóvenes: 'Limpiar',
                                    adultos: 'Limpiar',
                                })}
                            </Button>
                            <Button type="submit" disabled={processing || isSubmitting}>
                                {getTextByMode({
                                    niños: '💾 ¡Guardar!',
                                    jóvenes: 'Guardar',
                                    adultos: 'Guardar',
                                })}
                            </Button>
                        </div>
                    </form>
                </FormSection>
            </div>
        </DashboardLayout>
    );
} 