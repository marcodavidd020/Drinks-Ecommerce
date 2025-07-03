import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Producto {
    id: number;
    nombre: string;
    cod_producto: string;
    categoria?: {
        nombre: string;
    };
}

interface PromocionCreateProps {
    productos: Producto[];
}

export default function PromocionCreate({ productos }: PromocionCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        fecha_inicio: '',
        fecha_fin: '',
        descuento: '',
        producto_id: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/promociones', {
            onSuccess: () => {
                // Redirigir al índice después del éxito
            },
            onError: (errors) => {
                console.error('Errores de validación:', errors);
            },
        });
    };

    return (
        <DashboardLayout title="Crear Promoción">
            <Head title="Crear Promoción" />

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            🎉 Crear Nueva Promoción
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Crea una nueva promoción para productos
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Nombre de la Promoción *
                            </label>
                            <input
                                type="text"
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                placeholder="Ej: Descuento de Verano"
                                required
                            />
                            {errors.nombre && (
                                <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                            )}
                        </div>

                        {/* Fechas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Fecha de Inicio *
                                </label>
                                <input
                                    type="date"
                                    value={data.fecha_inicio}
                                    onChange={(e) => setData('fecha_inicio', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                    required
                                />
                                {errors.fecha_inicio && (
                                    <p className="mt-1 text-sm text-red-600">{errors.fecha_inicio}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Fecha de Fin *
                                </label>
                                <input
                                    type="date"
                                    value={data.fecha_fin}
                                    onChange={(e) => setData('fecha_fin', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                    required
                                />
                                {errors.fecha_fin && (
                                    <p className="mt-1 text-sm text-red-600">{errors.fecha_fin}</p>
                                )}
                            </div>
                        </div>

                        {/* Descuento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Descuento *
                            </label>
                            <input
                                type="text"
                                value={data.descuento}
                                onChange={(e) => setData('descuento', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                placeholder="Ej: 20%, $5, 15% descuento, $10 pesos de descuento"
                                required
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                💡 Puedes usar: porcentajes (20%), montos fijos ($5, 10 bs, 15 pesos) o texto descriptivo
                            </p>
                            {errors.descuento && (
                                <p className="mt-1 text-sm text-red-600">{errors.descuento}</p>
                            )}
                        </div>

                        {/* Producto */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Producto *
                            </label>
                            <select
                                value={data.producto_id}
                                onChange={(e) => setData('producto_id', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                                required
                            >
                                <option value="">Seleccionar producto</option>
                                {productos && productos.map((producto) => (
                                    <option key={producto.id} value={producto.id}>
                                        {producto.nombre} ({producto.cod_producto})
                                    </option>
                                ))}
                            </select>
                            {errors.producto_id && (
                                <p className="mt-1 text-sm text-red-600">{errors.producto_id}</p>
                            )}
                        </div>

                        {/* Botones */}
                        <div className="flex justify-end space-x-4 pt-4">
                            <a
                                href="/promociones"
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                            >
                                Cancelar
                            </a>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Guardando...' : 'Crear Promoción'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Debug Info */}
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Debug Info:
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        Productos disponibles: {productos ? productos.length : 0}
                    </p>
                    {productos && productos.length > 0 && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            Primer producto: {productos[0].nombre}
                        </p>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
