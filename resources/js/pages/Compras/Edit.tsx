import { FormButtons, FormPage, InputField, SelectField, TextareaField, PriceField } from '@/components/Form';
import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';

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
}

interface ComprasEditProps {
    compra: Compra;
    proveedores: Proveedor[];
    productos: Producto[];
}

interface CompraFormData {
    proveedor_id: string;
    fecha: string;
    estado: string;
    observaciones: string;
    productos: ProductoSeleccionado[];
}

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
        productos: [],
    });

    // Cargar productos existentes al montar el componente
    useEffect(() => {
        const productosIniciales = compra.detalles.map(detalle => ({
            id: detalle.producto.id,
            cantidad: detalle.cantidad,
            precio_unitario: detalle.precio_unitario,
            subtotal: detalle.subtotal,
        }));
        setProductosSeleccionados(productosIniciales);
    }, [compra.detalles]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const agregarProducto = () => {
        if (!productoSeleccionado || cantidad <= 0 || precioUnitario <= 0) {
            return;
        }

        const producto = productos.find(p => p.id === parseInt(productoSeleccionado));
        if (!producto) return;

        // Verificar si el producto ya está seleccionado
        const existeProducto = productosSeleccionados.find(p => p.id === producto.id);
        if (existeProducto) {
            // Actualizar cantidad y precio si ya existe
            const nuevosProductos = productosSeleccionados.map(p =>
                p.id === producto.id
                ? { ...p, cantidad: cantidad, precio_unitario: precioUnitario, subtotal: cantidad * precioUnitario }
                : p
            );
            setProductosSeleccionados(nuevosProductos);
        } else {
            // Agregar nuevo producto
            const nuevoProducto: ProductoSeleccionado = {
                id: producto.id,
                cantidad: cantidad,
                precio_unitario: precioUnitario,
                subtotal: cantidad * precioUnitario,
            };
            setProductosSeleccionados([...productosSeleccionados, nuevoProducto]);
        }

        // Limpiar formulario
        setProductoSeleccionado('');
        setCantidad(1);
        setPrecioUnitario(0);
    };

    const eliminarProducto = (productId: number) => {
        setProductosSeleccionados(productosSeleccionados.filter(p => p.id !== productId));
    };

    const editarProducto = (productId: number) => {
        const producto = productosSeleccionados.find(p => p.id === productId);
        if (producto) {
            setProductoSeleccionado(productId.toString());
            setCantidad(producto.cantidad);
            setPrecioUnitario(producto.precio_unitario);
            // Remover el producto de la lista para evitar duplicados
            eliminarProducto(productId);
        }
    };

    const calcularTotal = () => {
        return productosSeleccionados.reduce((total, producto) => total + producto.subtotal, 0);
    };

    const handleProductoChange = (productId: string) => {
        setProductoSeleccionado(productId);
        const producto = productos.find(p => p.id === parseInt(productId));
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

        const formData = {
            ...data,
            productos: productosSeleccionados,
        };

        put(route('compras.update', compra.id), {
            data: formData,
            onSuccess: () => {
                // Redirigir será manejado por el controlador
            },
        });
    };

    return (
        <DashboardLayout>
            <Head title={getTextByMode({
                niños: `✏️ Editar Compra #${compra.id}`,
                jóvenes: `Editar Compra #${compra.id}`,
                adultos: `Editar Compra #${compra.id}`,
            })} />

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
                backText="Volver a compra"
            >
                <form onSubmit={submit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <option value="">Selecciona un proveedor</option>
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
                        onChange={(e) => setData('estado', e.target.value)}
                        error={errors.estado}
                        required
                    >
                        <option value="pendiente">Pendiente</option>
                        <option value="recibida">Recibida</option>
                        <option value="cancelada">Cancelada</option>
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
                            placeholder="Observaciones adicionales sobre la compra..."
                        />
                    </div>
                </div>

                {/* Sección de Productos */}
                <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                        {getTextByMode({
                            niños: '🛒 Productos de la Compra',
                            jóvenes: 'Productos de la Compra',
                            adultos: 'Productos de la Compra',
                        })}
                    </h3>

                    {/* Formulario para agregar/editar productos */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <SelectField
                                label={getTextByMode({
                                    niños: '📦 Producto',
                                    jóvenes: 'Producto',
                                    adultos: 'Producto',
                                })}
                                value={productoSeleccionado}
                                onChange={(e) => handleProductoChange(e.target.value)}
                            >
                                <option value="">Selecciona un producto</option>
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
                                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
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
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                            <table className="w-full divide-y divide-gray-200 dark:divide-gray-600">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Producto
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Cantidad
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Precio Unitario
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Subtotal
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                    {productosSeleccionados.map((producto) => {
                                        const productoInfo = productos.find(p => p.id === producto.id);
                                        return (
                                            <tr key={producto.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {productoInfo?.nombre}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {producto.cantidad}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {formatCurrency(producto.precio_unitario)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {formatCurrency(producto.subtotal)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                        Total de la Compra:
                                    </span>
                                    <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                        {formatCurrency(calcularTotal())}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {productosSeleccionados.length === 0 && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
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
