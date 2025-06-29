import { FormButtons, FormPage, InputField, SelectField, TextareaField, PriceField } from '@/components/Form';
import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { formatCurrency } from '@/lib/currency';

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

interface ProductoSeleccionado {
    id: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
}

interface ComprasCreateProps {
    proveedores: Proveedor[];
    productos: Producto[];
}

export default function ComprasCreate({ proveedores, productos }: ComprasCreateProps) {
    const { getTextByMode } = useAppModeText();
    const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoSeleccionado[]>([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState<string>('');
    const [cantidad, setCantidad] = useState<number>(1);
    const [precioUnitario, setPrecioUnitario] = useState<number>(0);

    const { data, setData, post, processing, errors } = useForm({
        proveedor_id: '',
        fecha: new Date().toISOString().split('T')[0],
        estado: 'pendiente' as const,
        observaciones: '',
        productos: [] as any[], // eslint-disable-line @typescript-eslint/no-explicit-any
    });

    const agregarProducto = () => {
        if (!productoSeleccionado || cantidad <= 0 || precioUnitario <= 0) {
            return;
        }

        const producto = productos.find(p => p.id === parseInt(productoSeleccionado));
        if (!producto) return;

        // Verificar si el producto ya está seleccionado
        const existeProducto = productosSeleccionados.find(p => p.id === producto.id);
        let nuevosProductos;
        if (existeProducto) {
            // Actualizar cantidad y precio si ya existe
            nuevosProductos = productosSeleccionados.map(p =>
                p.id === producto.id
                ? { ...p, cantidad: cantidad, precio_unitario: precioUnitario, subtotal: cantidad * precioUnitario }
                : p
            );
        } else {
            // Agregar nuevo producto
            const nuevoProducto: ProductoSeleccionado = {
                id: producto.id,
                cantidad: cantidad,
                precio_unitario: precioUnitario,
                subtotal: cantidad * precioUnitario,
            };
            nuevosProductos = [...productosSeleccionados, nuevoProducto];
        }

        setProductosSeleccionados(nuevosProductos);
        setData('productos', nuevosProductos as any); // eslint-disable-line @typescript-eslint/no-explicit-any

        // Limpiar formulario
        setProductoSeleccionado('');
        setCantidad(1);
        setPrecioUnitario(0);
    };

    const eliminarProducto = (productId: number) => {
        setProductosSeleccionados(productosSeleccionados.filter(p => p.id !== productId));
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
        console.log('Submit iniciado');
        console.log('Datos del formulario:', data);
        console.log('Productos seleccionados:', productosSeleccionados);

        if (productosSeleccionados.length === 0) {
            alert('Debe seleccionar al menos un producto');
            return;
        }

        console.log('Enviando datos con productos:', productosSeleccionados);

        // Enviar los datos directamente incluyendo los productos
        post(route('compras.store'), {
            ...data,
            productos: productosSeleccionados
        } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    };

    return (
        <DashboardLayout>
            <Head title={getTextByMode({
                niños: '➕ Nueva Compra',
                jóvenes: 'Nueva Compra',
                adultos: 'Crear Nueva Compra',
            })} />

            <FormPage
                title={getTextByMode({
                    niños: '🛍️ Crear Nueva Compra',
                    jóvenes: 'Crear Nueva Compra',
                    adultos: 'Crear Nueva Compra',
                })}
                description={getTextByMode({
                    niños: 'Registra una nueva compra de productos a un proveedor',
                    jóvenes: 'Registra una nueva compra de productos',
                    adultos: 'Registra una nueva compra de productos a un proveedor',
                })}
                backHref={route('compras.index')}
                backText="Volver a compras"
            >
                <form onSubmit={submit} className="space-y-6">
                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SelectField
                        label={getTextByMode({
                            niños: '🏪 Proveedor',
                            jóvenes: 'Proveedor',
                            adultos: 'Proveedor',
                        })}
                                value={data.proveedor_id as string}
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
        value={data.fecha as string}
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
        value={data.estado as string}
        onChange={(e) => setData('estado', e.target.value as any)} // eslint-disable-line @typescript-eslint/no-explicit-any
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
            value={data.observaciones as string}
            onChange={(e) => setData('observaciones', e.target.value)}
            error={errors.observaciones}
                            rows={3}
                            placeholder="Observaciones adicionales sobre la compra..."
                        />
                    </div>
                        </div>
                    </div>

                    {/* Sección de Productos */}
                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                        {getTextByMode({
                            niños: '🛒 Productos de la Compra',
                            jóvenes: 'Productos de la Compra',
                            adultos: 'Productos de la Compra',
                        })}
                    </h3>

                    {/* Formulario para agregar productos */}
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
                                                    <button
                                                        type="button"
                                                        onClick={() => eliminarProducto(producto.id)}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                    >
                                                        Eliminar
                                                    </button>
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
                        submitLabel={getTextByMode({
                            niños: '💾 Guardar Compra',
                            jóvenes: 'Guardar Compra',
                            adultos: 'Crear Compra',
                        })}
                        cancelHref={route('compras.index')}
                        cancelLabel="Cancelar"
                    />
                </form>
            </FormPage>
        </DashboardLayout>
    );
}
 