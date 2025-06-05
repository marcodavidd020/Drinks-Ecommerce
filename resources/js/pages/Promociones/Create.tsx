import { FormButtons, FormPage, InputField, TextareaField } from '@/components/Form';
import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';

interface Producto {
    id: number;
    nombre: string;
    cod_producto: string;
    categoria?: {
        nombre: string;
    };
}

interface ProductoSeleccionado {
    id: number;
    nombre: string;
    cod_producto: string;
    categoria?: {
        nombre: string;
    };
    descuento_porcentaje?: number;
    descuento_fijo?: number;
}

interface PromocionCreateProps {
    productos: Producto[];
}

export default function PromocionCreate({ productos }: PromocionCreateProps) {
    const { getTextByMode, getModeClasses } = useAppModeText();
    const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoSeleccionado[]>([]);
    const [busquedaProducto, setBusquedaProducto] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        descripcion: '',
        fecha_inicio: '',
        fecha_fin: '',
        estado: 'activa',
        productos: [] as any[],
    });

    const productosFiltrados = productos.filter(producto =>
        !productosSeleccionados.find(p => p.id === producto.id) &&
        (producto.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
         producto.cod_producto.toLowerCase().includes(busquedaProducto.toLowerCase()))
    );

    const agregarProducto = (producto: Producto) => {
        const nuevoProducto: ProductoSeleccionado = {
            ...producto,
            descuento_porcentaje: 10,
            descuento_fijo: 0,
        };
        const nuevosProductos = [...productosSeleccionados, nuevoProducto];
        setProductosSeleccionados(nuevosProductos);
        setData('productos', nuevosProductos);
        setBusquedaProducto('');
    };

    const removerProducto = (id: number) => {
        const nuevosProductos = productosSeleccionados.filter(p => p.id !== id);
        setProductosSeleccionados(nuevosProductos);
        setData('productos', nuevosProductos);
    };

    const actualizarDescuentoProducto = (id: number, campo: 'descuento_porcentaje' | 'descuento_fijo', valor: number) => {
        const nuevosProductos = productosSeleccionados.map(p => 
            p.id === id ? { ...p, [campo]: valor } : p
        );
        setProductosSeleccionados(nuevosProductos);
        setData('productos', nuevosProductos);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/promociones');
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '🎉 ¡Crear Promoción!',
                jóvenes: '🎉 Crear Promoción',
                adultos: 'Crear Nueva Promoción',
            })}
        >
            <Head title="Crear Promoción" />

            <FormPage
                title={getTextByMode({
                    niños: '🎊 ¡Crear Promoción Súper Genial!',
                    jóvenes: '✨ Crear Nueva Promoción',
                    adultos: 'Crear Nueva Promoción',
                })}
                description={getTextByMode({
                    niños: '¡Crea descuentos increíbles para muchos productos!',
                    jóvenes: 'Crea promociones y descuentos para múltiples productos',
                    adultos: 'Configure promociones y descuentos para múltiples productos',
                })}
                backHref="/promociones"
                backText={getTextByMode({
                    niños: '¡Volver a promociones!',
                    jóvenes: 'Volver a promociones',
                    adultos: 'Volver a promociones',
                })}
            >
                <form onSubmit={submit} className="space-y-6">
                    {/* Información básica de la promoción */}
                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <h2 className={`mb-4 text-lg font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '📝 Información de la Promoción',
                                jóvenes: '📝 Datos de la Promoción',
                                adultos: 'Información de la Promoción',
                            })}
                        </h2>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                            <InputField
                                label={getTextByMode({
                                    niños: '🎁 Nombre de la Promoción',
                                    jóvenes: '🎁 Nombre de la Promoción',
                                    adultos: 'Nombre de la Promoción',
                                })}
                                type="text"
                                                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                placeholder={getTextByMode({
                                    niños: '¡Descuento Súper Genial!',
                                    jóvenes: 'Descuento de Verano',
                                    adultos: 'Ingrese el nombre de la promoción',
                                })}
                                error={errors.nombre}
                                required
                            />

                            <div className="flex gap-4">
                                <InputField
                                    label={getTextByMode({
                                        niños: '📅 ¿Cuándo empieza?',
                                        jóvenes: '📅 Fecha de Inicio',
                                        adultos: 'Fecha de Inicio',
                                    })}
                                    type="date"
                                    value={data.fecha_inicio as string}
                                    onChange={(e) => setData('fecha_inicio', e.target.value)}
                                    error={errors.fecha_inicio}
                                    required
                                />

                                <InputField
                                    label={getTextByMode({
                                        niños: '📅 ¿Cuándo termina?',
                                        jóvenes: '📅 Fecha de Fin',
                                        adultos: 'Fecha de Fin',
                                    })}
                                    type="date"
                                    value={data.fecha_fin as string}
                                    onChange={(e) => setData('fecha_fin', e.target.value)}
                                    error={errors.fecha_fin}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Selección de productos */}
                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <h2 className={`mb-4 text-lg font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '📦 ¡Elige los Productos!',
                                jóvenes: '📦 Seleccionar Productos',
                                adultos: 'Selección de Productos',
                            })}
                        </h2>

                        {/* Buscador de productos */}
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder={getTextByMode({
                                    niños: '🔍 ¡Busca productos para agregar!',
                                    jóvenes: '🔍 Buscar productos...',
                                    adultos: 'Buscar productos por nombre o código',
                                })}
                                value={busquedaProducto}
                                onChange={(e) => setBusquedaProducto(e.target.value)}
                                className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                            />
                        </div>

                        {/* Lista de productos para agregar */}
                        {busquedaProducto && productosFiltrados.length > 0 && (
                            <div className="mb-4 max-h-40 overflow-y-auto rounded border border-gray-200 dark:border-gray-600">
                                {productosFiltrados.slice(0, 5).map((producto) => (
                                    <button
                                        key={producto.id}
                                        type="button"
                                        onClick={() => agregarProducto(producto)}
                                        className={`w-full p-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${getModeClasses()}`}
                                    >
                                        <div className="font-medium text-gray-900 dark:text-gray-100">
                                            {producto.nombre}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {producto.cod_producto} {producto.categoria && `• ${producto.categoria.nombre}`}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Error de productos */}
                        {errors.productos && (
                            <div className="mb-4 text-sm text-red-600 dark:text-red-400">
                                {errors.productos}
                            </div>
                        )}

                        {/* Productos seleccionados */}
                        {productosSeleccionados.length > 0 ? (
                            <div className="space-y-4">
                                <h3 className={`text-md font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: `🎯 Productos Seleccionados (${productosSeleccionados.length})`,
                                        jóvenes: `Productos Seleccionados (${productosSeleccionados.length})`,
                                        adultos: `Productos Seleccionados (${productosSeleccionados.length})`,
                                    })}
                                </h3>
                                {productosSeleccionados.map((producto) => (
                                    <div
                                        key={producto.id}
                                        className="rounded-lg border border-gray-200 p-4 dark:border-gray-600 dark:bg-gray-750"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className={`font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                                    {producto.nombre}
                                                </h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {producto.cod_producto} {producto.categoria && `• ${producto.categoria.nombre}`}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removerProducto(producto.id)}
                                                className="ml-4 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                                title={getTextByMode({
                                                    niños: '🗑️ ¡Quitar producto!',
                                                    jóvenes: 'Quitar producto',
                                                    adultos: 'Eliminar producto',
                                                })}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                        
                                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <div>
                                                <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}>
                                                    {getTextByMode({
                                                        niños: '💰 Descuento en %',
                                                        jóvenes: 'Descuento Porcentaje',
                                                        adultos: 'Descuento Porcentaje (%)',
                                                    })}
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    step="0.01"
                                                    value={producto.descuento_porcentaje || ''}
                                                    onChange={(e) =>
                                                        actualizarDescuentoProducto(
                                                            producto.id,
                                                            'descuento_porcentaje',
                                                            parseFloat(e.target.value) || 0
                                                        )
                                                    }
                                                    className={`mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div>
                                                <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}>
                                                    {getTextByMode({
                                                        niños: '💵 Descuento en $',
                                                        jóvenes: 'Descuento Fijo',
                                                        adultos: 'Descuento Fijo ($)',
                                                    })}
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={producto.descuento_fijo || ''}
                                                    onChange={(e) =>
                                                        actualizarDescuentoProducto(
                                                            producto.id,
                                                            'descuento_fijo',
                                                            parseFloat(e.target.value) || 0
                                                        )
                                                    }
                                                    className={`mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 ${getModeClasses()}`}
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={`rounded-lg border-2 border-dashed border-gray-300 p-8 text-center text-gray-500 dark:border-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '📦 ¡Busca y agrega productos para tu promoción!',
                                    jóvenes: 'Busca y selecciona productos para la promoción',
                                    adultos: 'Busque y seleccione productos para agregar a la promoción',
                                })}
                            </div>
                        )}
                    </div>

                    <FormButtons
                        isProcessing={processing}
                        submitLabel={getTextByMode({
                            niños: '💾 ¡Crear Promoción!',
                            jóvenes: '💾 Crear Promoción',
                            adultos: 'Crear Promoción',
                        })}
                        cancelHref="/promociones"
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
