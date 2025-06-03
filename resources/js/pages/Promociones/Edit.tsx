import { FormButtons, FormPage, FormSection } from '@/components/Form';
import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

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
    const [shouldSubmit, setShouldSubmit] = useState(false);
    const formSubmittedRef = useRef(false);

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
        const productosIniciales: ProductoSeleccionado[] = promocion.productos.map((producto) => ({
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
    const productosDisponibles = productos.filter((producto) => !productosSeleccionados.find((p) => p.id === producto.id));

    const productosFiltrados = productosDisponibles.filter(
        (producto) =>
            producto.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
            producto.cod_producto.toLowerCase().includes(busquedaProducto.toLowerCase()),
    );

    const agregarProducto = (producto: Producto) => {
        if (!productosSeleccionados.find((p) => p.id === producto.id)) {
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
        setProductosSeleccionados(productosSeleccionados.filter((p) => p.id !== productoId));
    };

    const actualizarDescuento = (productoId: number, campo: 'descuento_porcentaje' | 'descuento_fijo', valor: number | undefined) => {
        setProductosSeleccionados(
            productosSeleccionados.map((producto) => {
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
            }),
        );
    };

    const calcularPrecioConDescuento = (producto: ProductoSeleccionado) => {
        if (producto.descuento_porcentaje && producto.descuento_porcentaje > 0) {
            return producto.precio_venta * (1 - producto.descuento_porcentaje / 100);
        } else if (producto.descuento_fijo && producto.descuento_fijo > 0) {
            return Math.max(0, producto.precio_venta - producto.descuento_fijo);
        }
        return producto.precio_venta;
    };

    // Effect para enviar el formulario cuando se actualicen los productos
    useEffect(() => {
        if (shouldSubmit && data.productos.length > 0 && !formSubmittedRef.current) {
            formSubmittedRef.current = true;
            put(`/promociones/${promocion.id}`, {
                onFinish: () => {
                    formSubmittedRef.current = false;
                    setShouldSubmit(false);
                },
            });
        }
    }, [data.productos, shouldSubmit, promocion.id, put]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validar que haya productos seleccionados
        if (productosSeleccionados.length === 0) {
            alert(
                getTextByMode({
                    niños: '¡Debes agregar al menos un producto a la promoción!',
                    jóvenes: 'Debes seleccionar al menos un producto',
                    adultos: 'Debe seleccionar al menos un producto para la promoción',
                }),
            );
            return;
        }

        // Preparar productos para envío
        const productosParaEnvio = productosSeleccionados.map((producto) => ({
            id: producto.id,
            descuento_porcentaje: producto.descuento_porcentaje || undefined,
            descuento_fijo: producto.descuento_fijo || undefined,
        }));

        // Actualizar productos en el estado
        setData('productos', productosParaEnvio);

        // Marcar para enviar
        setShouldSubmit(true);
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
                                error: errors.nombre,
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
                                error: errors.fecha_inicio,
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
                                error: errors.fecha_fin,
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
                                    { value: 'inactiva', label: '⚫ Inactiva' },
                                ],
                                required: true,
                                error: errors.estado,
                            },
                        ]}
                        columns={2}
                    />

                    {/* Selección de productos */}
                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <h2 className={`mb-4 text-lg font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '🛍️ Productos en Promoción',
                                jóvenes: 'Gestionar Productos',
                                adultos: 'Gestión de Productos en la Promoción',
                            })}
                        </h2>

                        {/* Buscador de productos */}
                        <div className="mb-4">
                            <label className={`mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300 ${getModeClasses()}`}>
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
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
                                    placeholder={getTextByMode({
                                        niños: 'Escribe el nombre del producto...',
                                        jóvenes: 'Buscar por nombre o código...',
                                        adultos: 'Buscar por nombre o código de producto...',
                                    })}
                                />
                                {busquedaProducto && productosFiltrados.length > 0 && (
                                    <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-700">
                                        {productosFiltrados.slice(0, 10).map((producto) => (
                                            <button
                                                key={producto.id}
                                                type="button"
                                                onClick={() => agregarProducto(producto)}
                                                className="w-full border-b border-gray-100 px-4 py-2 text-left last:border-b-0 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-600"
                                            >
                                                <div className="font-medium text-gray-900 dark:text-gray-100">{producto.nombre}</div>
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
                                    <div key={producto.id} className="rounded-lg border border-gray-200 p-4 dark:border-gray-600">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 dark:text-gray-100">{producto.nombre}</h4>
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
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
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
                                                    onChange={(e) =>
                                                        actualizarDescuento(
                                                            producto.id,
                                                            'descuento_porcentaje',
                                                            e.target.value ? parseFloat(e.target.value) : undefined,
                                                        )
                                                    }
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
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
                                                    onChange={(e) =>
                                                        actualizarDescuento(
                                                            producto.id,
                                                            'descuento_fijo',
                                                            e.target.value ? parseFloat(e.target.value) : undefined,
                                                        )
                                                    }
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
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
                                                <div className="mt-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 dark:border-gray-600 dark:bg-gray-600">
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
                            <div className="py-8 text-center">
                                <div className="mb-2 text-4xl">{settings.ageMode === 'niños' ? '😔' : '🛍️'}</div>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {getTextByMode({
                                        niños: '¡No hay productos en esta promoción! Usa el buscador de arriba.',
                                        jóvenes: 'No hay productos. Usa el buscador para agregar.',
                                        adultos: 'No hay productos en esta promoción. Utilice el buscador para agregar productos.',
                                    })}
                                </p>
                            </div>
                        )}

                        {errors.productos && <p className="mt-2 text-sm text-red-600">{errors.productos}</p>}
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
