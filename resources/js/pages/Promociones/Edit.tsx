import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { FormPage, FormSection, FormButtons } from '@/components/Form';

interface Categoria {
    id: number;
    nombre: string;
}

interface Producto {
    id: number;
    nombre: string;
    cod_producto: string;
    precio_venta: number;
    categoria?: Categoria;
}

interface ProductoEnPromocion extends Producto {
    pivot: {
        descuento_porcentaje?: number;
        descuento_fijo?: number;
    };
}

interface ProductoSeleccionado extends Producto {
    descuento_porcentaje?: number;
    descuento_fijo?: number;
}

interface Promocion {
    id: number;
    nombre: string;
    fecha_inicio: string;
    fecha_fin: string;
    estado: 'activa' | 'inactiva';
    productos: ProductoEnPromocion[];
}

interface PromocionEditProps {
    promocion: Promocion;
    productos: Producto[];
}

export default function PromocionEdit({ promocion, productos }: PromocionEditProps) {
    const { settings } = useAppMode();
    const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoSeleccionado[]>([]);
    const [busquedaProducto, setBusquedaProducto] = useState('');

    const { data, setData, put, processing, errors } = useForm({
        nombre: promocion.nombre,
        fecha_inicio: promocion.fecha_inicio,
        fecha_fin: promocion.fecha_fin,
        estado: promocion.estado as 'activa' | 'inactiva',
        productos: [] as Array<{
            id: number;
            descuento_porcentaje?: number;
            descuento_fijo?: number;
        }>,
    });

    // Cargar productos existentes al montar el componente
    useEffect(() => {
        const productosIniciales: ProductoSeleccionado[] = promocion.productos.map(producto => ({
            ...producto,
            descuento_porcentaje: producto.pivot.descuento_porcentaje,
            descuento_fijo: producto.pivot.descuento_fijo,
        }));
        setProductosSeleccionados(productosIniciales);
    }, [promocion.productos]);

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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Filtrar productos que no están ya seleccionados
    const productosDisponibles = productos.filter(producto =>
        !productosSeleccionados.find(p => p.id === producto.id)
    );

    const productosFiltrados = productosDisponibles.filter(producto =>
        producto.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
        producto.cod_producto.toLowerCase().includes(busquedaProducto.toLowerCase())
    );

    const agregarProducto = (producto: Producto) => {
        if (!productosSeleccionados.find(p => p.id === producto.id)) {
            const nuevoProducto: ProductoSeleccionado = {
                ...producto,
                descuento_porcentaje: 10,
                descuento_fijo: undefined,
            };
            setProductosSeleccionados([...productosSeleccionados, nuevoProducto]);
            setBusquedaProducto('');
        }
    };

    const removerProducto = (productoId: number) => {
        setProductosSeleccionados(productosSeleccionados.filter(p => p.id !== productoId));
    };

    const actualizarDescuento = (productoId: number, campo: 'descuento_porcentaje' | 'descuento_fijo', valor: number | undefined) => {
        setProductosSeleccionados(productosSeleccionados.map(producto => {
            if (producto.id === productoId) {
                const actualizado = { ...producto, [campo]: valor };
                
                // Si se está estableciendo un descuento, limpiar el otro
                if (valor !== undefined && valor > 0) {
                    if (campo === 'descuento_porcentaje') {
                        actualizado.descuento_fijo = undefined;
                    } else {
                        actualizado.descuento_porcentaje = undefined;
                    }
                }
                
                return actualizado;
            }
            return producto;
        }));
    };

    const calcularPrecioConDescuento = (producto: ProductoSeleccionado) => {
        if (producto.descuento_porcentaje && producto.descuento_porcentaje > 0) {
            return producto.precio_venta * (1 - producto.descuento_porcentaje / 100);
        } else if (producto.descuento_fijo && producto.descuento_fijo > 0) {
            return Math.max(0, producto.precio_venta - producto.descuento_fijo);
        }
        return producto.precio_venta;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validar que haya productos seleccionados
        if (productosSeleccionados.length === 0) {
            alert(getTextByMode({
                niños: '¡Debes agregar al menos un producto a la promoción!',
                jóvenes: 'Debes seleccionar al menos un producto',
                adultos: 'Debe seleccionar al menos un producto para la promoción',
            }));
            return;
        }

        // Preparar productos para envío
        const productosParaEnvio = productosSeleccionados.map(producto => ({
            id: producto.id,
            descuento_porcentaje: producto.descuento_porcentaje || null,
            descuento_fijo: producto.descuento_fijo || null,
        }));

        put(`/promociones/${promocion.id}`, {
            ...data,
            productos: productosParaEnvio,
        });
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '🏷️ Editar Promoción',
                jóvenes: 'Editar Promoción',
                adultos: 'Editar Promoción',
            })}
        >
            <Head title={`Editar: ${promocion.nombre}`} />

            <FormPage
                title={getTextByMode({
                    niños: '✏️ ¡Editar Promoción!',
                    jóvenes: 'Editar Promoción',
                    adultos: 'Editar Promoción',
                })}
                description={getTextByMode({
                    niños: '¡Modifica los datos y productos de tu promoción!',
                    jóvenes: 'Modifica la información y productos de la promoción',
                    adultos: 'Modifique la información y productos de la promoción existente',
                })}
                backHref="/promociones"
                backText={getTextByMode({
                    niños: '🔙 Volver',
                    jóvenes: 'Volver',
                    adultos: 'Volver',
                })}
                actions={[
                    {
                        href: `/promociones/${promocion.id}`,
                        text: getTextByMode({
                            niños: '👀 Ver',
                            jóvenes: 'Ver',
                            adultos: 'Ver Detalles',
                        }),
                        variant: 'secondary' as const,
                        icon: (
                            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )
                    }
                ]}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <FormSection
                        title={getTextByMode({
                            niños: '📝 Información de la Promoción',
                            jóvenes: 'Información Básica',
                            adultos: 'Información Básica de la Promoción',
                        })}
                        fields={[
                            {
                                type: 'text' as const,
                                name: 'nombre',
                                label: getTextByMode({
                                    niños: '🏷️ Nombre de la promoción',
                                    jóvenes: 'Nombre de la promoción',
                                    adultos: 'Nombre de la promoción',
                                }),
                                value: data.nombre,
                                onChange: (value: string) => setData('nombre', value),
                                placeholder: getTextByMode({
                                    niños: 'Ej: ¡Super Oferta de Navidad!',
                                    jóvenes: 'Ej: Oferta de Navidad 2024',
                                    adultos: 'Ejemplo: Promoción Black Friday 2024',
                                }),
                                span: 2 as const,
                                required: true,
                                error: errors.nombre
                            },
                            {
                                type: 'date' as const,
                                name: 'fecha_inicio',
                                label: getTextByMode({
                                    niños: '📅 Fecha de inicio',
                                    jóvenes: 'Fecha de inicio',
                                    adultos: 'Fecha de inicio',
                                }),
                                value: data.fecha_inicio,
                                onChange: (value: string) => setData('fecha_inicio', value),
                                required: true,
                                error: errors.fecha_inicio
                            },
                            {
                                type: 'date' as const,
                                name: 'fecha_fin',
                                label: getTextByMode({
                                    niños: '🏁 Fecha de fin',
                                    jóvenes: 'Fecha de fin',
                                    adultos: 'Fecha de finalización',
                                }),
                                value: data.fecha_fin,
                                onChange: (value: string) => setData('fecha_fin', value),
                                required: true,
                                error: errors.fecha_fin
                            },
                            {
                                type: 'select' as const,
                                name: 'estado',
                                label: getTextByMode({
                                    niños: '🚦 Estado',
                                    jóvenes: 'Estado',
                                    adultos: 'Estado',
                                }),
                                value: data.estado,
                                onChange: (value: string) => setData('estado', value as 'activa' | 'inactiva'),
                                options: [
                                    { value: 'activa', label: '🟢 Activa' },
                                    { value: 'inactiva', label: '⚫ Inactiva' }
                                ],
                                required: true,
                                error: errors.estado
                            }
                        ]}
                        columns={2}
                    />

                    {/* Selección de productos */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
                        <h2 className={`text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '🛍️ Productos en Promoción',
                                jóvenes: 'Gestionar Productos',
                                adultos: 'Gestión de Productos en la Promoción',
                            })}
                        </h2>

                        {/* Buscador de productos */}
                        <div className="mb-4">
                            <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🔍 Agregar más productos',
                                    jóvenes: 'Agregar productos',
                                    adultos: 'Buscar productos para agregar',
                                })}
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={busquedaProducto}
                                    onChange={(e) => setBusquedaProducto(e.target.value)}
                                    className={`block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-gray-200 sm:text-sm ${getModeClasses()}`}
                                    placeholder={getTextByMode({
                                        niños: 'Escribe el nombre del producto...',
                                        jóvenes: 'Buscar por nombre o código...',
                                        adultos: 'Buscar por nombre o código de producto...',
                                    })}
                                />
                                {busquedaProducto && productosFiltrados.length > 0 && (
                                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 max-h-60 overflow-auto">
                                        {productosFiltrados.slice(0, 10).map((producto) => (
                                            <button
                                                key={producto.id}
                                                type="button"
                                                onClick={() => agregarProducto(producto)}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-600 last:border-b-0"
                                            >
                                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                                    {producto.nombre}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {producto.cod_producto} | {formatCurrency(producto.precio_venta)}
                                                    {producto.categoria && ` | ${producto.categoria.nombre}`}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Lista de productos seleccionados */}
                        {productosSeleccionados.length > 0 && (
                            <div className="space-y-4">
                                <h3 className={`text-md font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                    {getTextByMode({
                                        niños: `🎯 Productos en la promoción (${productosSeleccionados.length})`,
                                        jóvenes: `Productos incluidos (${productosSeleccionados.length})`,
                                        adultos: `Productos incluidos (${productosSeleccionados.length})`,
                                    })}
                                </h3>

                                {productosSeleccionados.map((producto) => (
                                    <div key={producto.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                    {producto.nombre}
                                                </h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {producto.cod_producto} | Precio: {formatCurrency(producto.precio_venta)}
                                                    {producto.categoria && ` | ${producto.categoria.nombre}`}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removerProducto(producto.id)}
                                                className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                            <div>
                                                <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}>
                                                    {getTextByMode({
                                                        niños: '💯 Descuento %',
                                                        jóvenes: 'Descuento (%)',
                                                        adultos: 'Descuento Porcentual (%)',
                                                    })}
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    step="0.01"
                                                    value={producto.descuento_porcentaje || ''}
                                                    onChange={(e) => actualizarDescuento(
                                                        producto.id,
                                                        'descuento_porcentaje',
                                                        e.target.value ? parseFloat(e.target.value) : undefined
                                                    )}
                                                    className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-gray-200 sm:text-sm ${getModeClasses()}`}
                                                    placeholder="10"
                                                />
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}>
                                                    {getTextByMode({
                                                        niños: '💰 Descuento fijo',
                                                        jóvenes: 'Descuento fijo',
                                                        adultos: 'Descuento Fijo (COP)',
                                                    })}
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="100"
                                                    value={producto.descuento_fijo || ''}
                                                    onChange={(e) => actualizarDescuento(
                                                        producto.id,
                                                        'descuento_fijo',
                                                        e.target.value ? parseFloat(e.target.value) : undefined
                                                    )}
                                                    className={`mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:text-gray-200 sm:text-sm ${getModeClasses()}`}
                                                    placeholder="5000"
                                                />
                                            </div>

                                            <div>
                                                <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}>
                                                    {getTextByMode({
                                                        niños: '🎯 Precio final',
                                                        jóvenes: 'Precio final',
                                                        adultos: 'Precio Final',
                                                    })}
                                                </label>
                                                <div className="mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md">
                                                    <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                                                        {formatCurrency(calcularPrecioConDescuento(producto))}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {productosSeleccionados.length === 0 && (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-2">
                                    {settings.ageMode === 'niños' ? '😔' : '🛍️'}
                                </div>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {getTextByMode({
                                        niños: '¡No hay productos en esta promoción! Usa el buscador de arriba.',
                                        jóvenes: 'No hay productos. Usa el buscador para agregar.',
                                        adultos: 'No hay productos en esta promoción. Utilice el buscador para agregar productos.',
                                    })}
                                </p>
                            </div>
                        )}

                        {errors.productos && (
                            <p className="mt-2 text-sm text-red-600">{errors.productos}</p>
                        )}
                    </div>

                    <FormButtons
                        cancelHref={`/promociones/${promocion.id}`}
                        isProcessing={processing}
                        cancelText={getTextByMode({
                            niños: '❌ Cancelar',
                            jóvenes: 'Cancelar',
                            adultos: 'Cancelar',
                        })}
                        submitText={getTextByMode({
                            niños: '💾 ¡Guardar Cambios!',
                            jóvenes: '💾 Guardar Cambios',
                            adultos: 'Guardar Cambios',
                        })}
                        processingText={getTextByMode({
                            niños: '⏳ Guardando...',
                            jóvenes: 'Guardando...',
                            adultos: 'Guardando cambios...',
                        })}
                    />
                </form>
            </FormPage>
        </DashboardLayout>
    );
} 