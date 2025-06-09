import { FormButtons, FormPage, InputField, PriceField, SelectField, TextareaField } from '@/components/Form';
import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';

interface Proveedor {
    id: number;
    nombre: string;
    email?: string;
    telefono?: string;
}

interface Producto {
    id: number;
    nombre: string;
    precio_compra: number;
    precio_venta: number;
    categoria_id: number;
}

interface DetalleCompra {
    id: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    producto: Producto;
}

interface Compra {
    id: number;
    fecha: string;
    total: number;
    estado: 'pendiente' | 'recibida' | 'cancelada';
    observaciones?: string;
    proveedor_id: number;
    detalles: DetalleCompra[];
    created_at: string;
    updated_at: string;
}

interface ProductoSeleccionado {
    id: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    [key: string]: any;
}

interface ComprasEditProps {
    compra: Compra;
    proveedores: Proveedor[];
    productos: Producto[];
}

// interface CompraFormData {
//     proveedor_id: string;
//     fecha: string;
//     estado: 'pendiente' | 'recibida' | 'cancelada';
//     observaciones: string;
//     productos: ProductoSeleccionado[];
// }

export default function ComprasEdit({ compra, proveedores, productos }: ComprasEditProps) {
    const { getTextByMode } = useAppModeText();
    const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoSeleccionado[]>([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState<string>('');
    const [cantidad, setCantidad] = useState<number>(1);
    const [precioUnitario, setPrecioUnitario] = useState<number>(0);

    const { data, setData, put, processing, errors } = useForm({
        proveedor_id: compra.proveedor_id.toString(),
        fecha: compra.fecha,
        estado: compra.estado,
        observaciones: compra.observaciones || '',
        productos: [] as ProductoSeleccionado[],
    });

    // Cargar productos existentes al montar el componente
    useEffect(() => {
        const productosIniciales = compra.detalles.map((detalle) => ({
            id: detalle.producto.id,
            cantidad: detalle.cantidad,
            precio_unitario: detalle.precio_unitario,
            subtotal: detalle.subtotal,
        }));
        setProductosSeleccionados(productosIniciales);
    }, [compra.detalles]);

    const formatCurrency = (amount: number) => {
        // Verificar que amount es un número válido
        if (isNaN(amount) || amount === null || amount === undefined) {
            return '$0';
        }
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(Number(amount));
    };

    const agregarProducto = () => {
        if (!productoSeleccionado || cantidad <= 0 || precioUnitario <= 0) {
            return;
        }

        const producto = productos.find((p) => p.id === parseInt(productoSeleccionado));
        if (!producto) return;

        // Verificar si el producto ya está seleccionado
        const existeProducto = productosSeleccionados.find((p) => p.id === producto.id);
        if (existeProducto) {
            // Actualizar cantidad y precio si ya existe
            const nuevosProductos = productosSeleccionados.map((p) =>
                p.id === producto.id
                    ? {
                          ...p,
                          cantidad: Number(cantidad),
                          precio_unitario: Number(precioUnitario),
                          subtotal: Number(cantidad) * Number(precioUnitario),
                      }
                    : p,
            );
            setProductosSeleccionados(nuevosProductos);
        } else {
            // Agregar nuevo producto
            const nuevoProducto: ProductoSeleccionado = {
                id: producto.id,
                cantidad: Number(cantidad),
                precio_unitario: Number(precioUnitario),
                subtotal: Number(cantidad) * Number(precioUnitario),
            };
            setProductosSeleccionados([...productosSeleccionados, nuevoProducto]);
        }

        // Limpiar formulario
        setProductoSeleccionado('');
        setCantidad(1);
        setPrecioUnitario(0);
    };

    const eliminarProducto = (productId: number) => {
        setProductosSeleccionados(productosSeleccionados.filter((p) => p.id !== productId));
    };

    const editarProducto = (productId: number) => {
        const producto = productosSeleccionados.find((p) => p.id === productId);
        if (producto) {
            setProductoSeleccionado(productId.toString());
            setCantidad(producto.cantidad);
            setPrecioUnitario(producto.precio_unitario);
            // NO eliminar el producto, solo preparar para edición
        }
    };

    const calcularTotal = () => {
        return productosSeleccionados.reduce((total, producto) => total + producto.subtotal, 0);
    };

    const handleProductoChange = (productId: string) => {
        setProductoSeleccionado(productId);
        const producto = productos.find((p) => p.id === parseInt(productId));
        if (producto) {
            setPrecioUnitario(producto.precio_compra);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (productosSeleccionados.length === 0) {
            alert('Debe seleccionar al menos un producto');
            return;
        }

        // Actualizar todos los datos del formulario, incluyendo productos
        Object.assign(data, { productos: productosSeleccionados });

        // Enviar la actualización
        put(route('compras.update', compra.id));
    };

    return (
        <DashboardLayout>
            <Head
                title={getTextByMode({
                    niños: `✏️ Editar Compra #${compra.id}`,
                    jóvenes: `Editar Compra #${compra.id}`,
                    adultos: `Editar Compra #${compra.id}`,
                })}
            />

            <FormPage
                title={getTextByMode({
                    niños: `🛍️ Editar Compra #${compra.id}`,
                    jóvenes: `Editar Compra #${compra.id}`,
                    adultos: `Editar Compra #${compra.id}`,
                })}
                description={getTextByMode({
                    niños: 'Modifica los datos de la compra y sus productos',
                    jóvenes: 'Modifica los datos de la compra',
                    adultos: 'Modifica la información de la compra y sus productos asociados',
                })}
                backHref={route('compras.show', compra.id)}
                backText={getTextByMode({
                    niños: '🔙 Volver a la compra',
                    jóvenes: 'Volver a compra',
                    adultos: 'Volver a la compra',
                })}
            >
                <form onSubmit={submit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <SelectField
                            label={getTextByMode({
                                niños: '🏪 Proveedor',
                                jóvenes: 'Proveedor',
                                adultos: 'Proveedor',
                            })}
                            value={data.proveedor_id}
                            onChange={(e) => setData('proveedor_id', e.target.value)}
                            error={errors.proveedor_id}
                            required
                        >
                            <option value="">
                                {getTextByMode({
                                    niños: '🏪 Elige un proveedor',
                                    jóvenes: 'Selecciona un proveedor',
                                    adultos: 'Seleccionar proveedor',
                                })}
                            </option>
                            {proveedores.map((proveedor) => (
                                <option key={proveedor.id} value={proveedor.id}>
                                    {proveedor.nombre}
                                    {proveedor.email && ` (${proveedor.email})`}
                                </option>
                            ))}
                        </SelectField>

                        <InputField
                            label={getTextByMode({
                                niños: '📅 Fecha',
                                jóvenes: 'Fecha',
                                adultos: 'Fecha de Compra',
                            })}
                            type="date"
                            value={data.fecha}
                            onChange={(e) => setData('fecha', e.target.value)}
                            error={errors.fecha}
                            required
                        />

                        <SelectField
                            label={getTextByMode({
                                niños: '📊 Estado',
                                jóvenes: 'Estado',
                                adultos: 'Estado',
                            })}
                            value={data.estado}
                            onChange={(e) => setData('estado', e.target.value as 'pendiente' | 'recibida' | 'cancelada')}
                            error={errors.estado}
                            required
                        >
                            <option value="pendiente">
                                {getTextByMode({
                                    niños: '⏳ Pendiente',
                                    jóvenes: 'Pendiente',
                                    adultos: 'Pendiente',
                                })}
                            </option>
                            <option value="recibida">
                                {getTextByMode({
                                    niños: '✅ Recibida',
                                    jóvenes: 'Recibida',
                                    adultos: 'Recibida',
                                })}
                            </option>
                            <option value="cancelada">
                                {getTextByMode({
                                    niños: '❌ Cancelada',
                                    jóvenes: 'Cancelada',
                                    adultos: 'Cancelada',
                                })}
                            </option>
                        </SelectField>

                        <div className="md:col-span-2">
                            <TextareaField
                                label={getTextByMode({
                                    niños: '📝 Observaciones',
                                    jóvenes: 'Observaciones',
                                    adultos: 'Observaciones',
                                })}
                                value={data.observaciones}
                                onChange={(e) => setData('observaciones', e.target.value)}
                                error={errors.observaciones}
                                rows={3}
                                placeholder={getTextByMode({
                                    niños: '✨ Escribe algo súper genial sobre la compra...',
                                    jóvenes: 'Observaciones adicionales sobre la compra...',
                                    adultos: 'Observaciones adicionales sobre la compra...',
                                })}
                            />
                        </div>
                    </div>

                    {/* Sección de Productos */}
                    <div className="mt-8">
                        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                            {getTextByMode({
                                niños: '🛒 Productos de la Compra',
                                jóvenes: 'Productos de la Compra',
                                adultos: 'Productos de la Compra',
                            })}
                        </h3>

                        {/* Formulario para agregar/editar productos */}
                        <div className="mb-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                <SelectField
                                    label={getTextByMode({
                                        niños: '📦 Producto',
                                        jóvenes: 'Producto',
                                        adultos: 'Producto',
                                    })}
                                    value={productoSeleccionado}
                                    onChange={(e) => handleProductoChange(e.target.value)}
                                >
                                    <option value="">
                                        {getTextByMode({
                                            niños: '📦 Elige un producto',
                                            jóvenes: 'Selecciona un producto',
                                            adultos: 'Seleccionar producto',
                                        })}
                                    </option>
                                    {productos.map((producto) => (
                                        <option key={producto.id} value={producto.id}>
                                            {producto.nombre}
                                        </option>
                                    ))}
                                </SelectField>

                                <InputField
                                    label={getTextByMode({
                                        niños: '🔢 Cantidad',
                                        jóvenes: 'Cantidad',
                                        adultos: 'Cantidad',
                                    })}
                                    type="number"
                                    min="1"
                                    value={cantidad}
                                    onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                                />

                                <PriceField
                                    label={getTextByMode({
                                        niños: '💰 Precio Unitario',
                                        jóvenes: 'Precio Unitario',
                                        adultos: 'Precio Unitario',
                                    })}
                                    value={precioUnitario}
                                    onChange={(e) => setPrecioUnitario(parseFloat(e.target.value) || 0)}
                                />

                                <div className="flex items-end">
                                    <button
                                        type="button"
                                        onClick={agregarProducto}
                                        className="w-full rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
                                    >
                                        {getTextByMode({
                                            niños: '➕ Agregar',
                                            jóvenes: 'Agregar',
                                            adultos: 'Agregar Producto',
                                        })}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Lista de productos seleccionados */}
                        {productosSeleccionados.length > 0 && (
                            <div className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800">
                                <table className="w-full divide-y divide-gray-200 dark:divide-gray-600">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                Producto
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                Cantidad
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                Precio Unitario
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                Subtotal
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                        {productosSeleccionados.map((producto) => {
                                            const productoInfo = productos.find((p) => p.id === producto.id);
                                            return (
                                                <tr key={producto.id}>
                                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                        {productoInfo?.nombre}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                        {producto.cantidad}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                        {formatCurrency(producto.precio_unitario)}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900 dark:text-gray-100">
                                                        {formatCurrency(producto.subtotal)}
                                                    </td>
                                                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                        <div className="flex justify-end space-x-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => editarProducto(producto.id)}
                                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                            >
                                                                Editar
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => eliminarProducto(producto.id)}
                                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                {/* Total */}
                                <div className="bg-gray-50 px-6 py-4 dark:bg-gray-700">
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-medium text-gray-900 dark:text-gray-100">Total de la Compra:</span>
                                        <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(calcularTotal())}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {productosSeleccionados.length === 0 && (
                            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                                {getTextByMode({
                                    niños: '📦 No hay productos seleccionados',
                                    jóvenes: 'No hay productos seleccionados',
                                    adultos: 'No hay productos seleccionados para esta compra',
                                })}
                            </div>
                        )}
                    </div>

                    <FormButtons
                        isProcessing={processing}
                        cancelHref={route('compras.show', compra.id)}
                        submitLabel={getTextByMode({
                            niños: '💾 Actualizar Compra',
                            jóvenes: 'Actualizar Compra',
                            adultos: 'Actualizar Compra',
                        })}
                        cancelLabel="Cancelar"
                    />
                </form>
            </FormPage>
        </DashboardLayout>
    );
}
