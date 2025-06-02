import { FormButtons, FormPage, FormSection } from '@/components/Form';
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

            <FormPage
                title={getTextByMode({
                    niños: '📦 ¡Agregar un Producto al Inventario!',
                    jóvenes: 'Agregar Producto al Inventario',
                    adultos: 'Registrar Producto en Inventario',
                })}
                description={getTextByMode({
                    niños: '¡Aquí puedes añadir un producto a un almacén!',
                    jóvenes: 'Agrega un producto al inventario de un almacén',
                    adultos: 'Complete el formulario para registrar un producto en el inventario',
                })}
                backHref="/inventarios"
                backText={getTextByMode({
                    niños: '¡Volver al Inventario!',
                    jóvenes: 'Volver al Inventario',
                    adultos: 'Volver al Inventario',
                })}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <FormSection
                        title={getTextByMode({
                            niños: '📦 Datos del Producto',
                            jóvenes: 'Información del Producto',
                            adultos: 'Información del Producto',
                        })}
                    >
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="col-span-2">
                                <label
                                    htmlFor="producto_id"
                                    className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}
                                >
                                    {getTextByMode({
                                        niños: '📦 Producto',
                                        jóvenes: 'Producto',
                                        adultos: 'Producto',
                                    })}
                                </label>
                                <select
                                    id="producto_id"
                                    name="producto_id"
                                    value={data.producto_id}
                                    onChange={(e) => setData('producto_id', e.target.value)}
                                    className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                    required
                                >
                                    {productoOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.producto_id && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.producto_id}</p>}
                            </div>

                            <div className="col-span-2">
                                <label
                                    htmlFor="almacen_id"
                                    className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}
                                >
                                    {getTextByMode({
                                        niños: '🏬 Almacén',
                                        jóvenes: 'Almacén',
                                        adultos: 'Almacén',
                                    })}
                                </label>
                                <select
                                    id="almacen_id"
                                    name="almacen_id"
                                    value={data.almacen_id}
                                    onChange={(e) => setData('almacen_id', e.target.value)}
                                    className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                    required
                                >
                                    {almacenOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.almacen_id && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.almacen_id}</p>}
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                                <label
                                    htmlFor="stock"
                                    className={`mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}
                                >
                                    {getTextByMode({
                                        niños: '📊 Cantidad',
                                        jóvenes: 'Stock',
                                        adultos: 'Stock Inicial',
                                    })}
                                </label>
                                <input
                                    type="number"
                                    id="stock"
                                    name="stock"
                                    value={data.stock}
                                    onChange={(e) => setData('stock', e.target.value)}
                                    min="0"
                                    step="1"
                                    className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                    required
                                    placeholder="Cantidad en stock"
                                />
                                {errors.stock && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.stock}</p>}
                            </div>
                        </div>
                    </FormSection>

                    <FormButtons
                        isProcessing={processing || isSubmitting}
                        submitLabel={getTextByMode({
                            niños: '💾 ¡Guardar!',
                            jóvenes: 'Guardar',
                            adultos: 'Guardar',
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
