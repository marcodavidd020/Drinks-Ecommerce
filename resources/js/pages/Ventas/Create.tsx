import { FormButtons, FormPage, InputField, SelectField, TextareaField, NumberField } from '@/components/Form';
import { Button } from '@/components/ui/button';
import { useAppModeText } from '@/hooks/useAppModeText';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent, useEffect, useState } from 'react';
import { formatCurrency } from '@/lib/currency';

interface Categoria {
    id: number;
    nombre: string;
}

interface Producto {
    id: number;
    nombre: string;
    cod_producto: string;
    precio_venta: number;
    stock_disponible: number;
    categoria?: Categoria;
}

interface DetalleVenta {
    id: string; // ID temporal para gestión en el cliente
    producto_id: number;
    nombre_producto: string;
    codigo_producto: string;
    cantidad: number;
    precio_unitario: number;
    total: number;
}

interface VentaCreateProps {
    productos: Producto[];
    fecha_actual: string;
}

export default function VentaCreate({ productos, fecha_actual }: VentaCreateProps) {
    const { getTextByMode, getModeClasses, settings } = useAppModeText();
    const [detalles, setDetalles] = useState<DetalleVenta[]>([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState<number | ''>('');
    const [cantidad, setCantidad] = useState<number>(1);
    const [precio, setPrecio] = useState<number>(0);
    const [filtroBusqueda, setFiltroBusqueda] = useState('');
    const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>(productos);

    const { data, setData, post, processing, errors, reset } = useForm({
        fecha: fecha_actual,
        observaciones: '',
        detalles: [] as Array<{
            producto_id: number;
            cantidad: number;
            precio_unitario: number;
            total: number;
        }>,
        completar_automaticamente: true as boolean,
    });

    // Actualizar los productos filtrados cuando cambia el filtro de búsqueda
    useEffect(() => {
        if (filtroBusqueda.trim() === '') {
            setProductosFiltrados(productos);
        } else {
            const filtrados = productos.filter(
                (p) =>
                    p.nombre.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
                    p.cod_producto.toLowerCase().includes(filtroBusqueda.toLowerCase()) ||
                    (p.categoria?.nombre || '').toLowerCase().includes(filtroBusqueda.toLowerCase()),
            );
            setProductosFiltrados(filtrados);
        }
    }, [filtroBusqueda, productos]);

    // Actualizar el precio cuando cambia el producto seleccionado
    useEffect(() => {
        if (productoSeleccionado !== '') {
            const producto = productos.find((p) => p.id === Number(productoSeleccionado));
            if (producto) {
                setPrecio(producto.precio_venta);
            }
        } else {
            setPrecio(0);
        }
    }, [productoSeleccionado, productos]);

    // Cuando cambian los detalles, actualizar el formulario
    useEffect(() => {
        // Transformar los detalles al formato esperado por el backend
        const detallesFormateados = detalles.map((detalle) => ({
            producto_id: detalle.producto_id,
            cantidad: detalle.cantidad,
            precio_unitario: detalle.precio_unitario,
            total: detalle.total,
        }));

        setData('detalles', detallesFormateados);
    }, [detalles, setData]);

    const agregarDetalle = () => {
        if (productoSeleccionado === '') {
            alert('Debe seleccionar un producto');
            return;
        }

        if (cantidad <= 0) {
            alert('La cantidad debe ser mayor a 0');
            return;
        }

        if (precio <= 0) {
            alert('El precio debe ser mayor a 0');
            return;
        }

        const producto = productos.find((p) => p.id === Number(productoSeleccionado));
        if (!producto) {
            alert('Producto no encontrado');
            return;
        }

        if (cantidad > producto.stock_disponible) {
            alert(`No hay suficiente stock. Disponible: ${producto.stock_disponible}`);
            return;
        }

        // Verificar si ya existe este producto en los detalles
        const existeProducto = detalles.findIndex((d) => d.producto_id === Number(productoSeleccionado));

        if (existeProducto >= 0) {
            // Actualizar la cantidad y total
            const nuevosDetalles = [...detalles];
            nuevosDetalles[existeProducto].cantidad += cantidad;
            nuevosDetalles[existeProducto].total = nuevosDetalles[existeProducto].cantidad * nuevosDetalles[existeProducto].precio_unitario;

            // Validar que no exceda el stock disponible
            if (nuevosDetalles[existeProducto].cantidad > producto.stock_disponible) {
                alert(`La cantidad total excede el stock disponible. Máximo: ${producto.stock_disponible}`);
                return;
            }

            setDetalles(nuevosDetalles);
        } else {
            // Agregar nuevo detalle
            const nuevoDetalle: DetalleVenta = {
                id: `temp-${Date.now()}`,
                producto_id: Number(productoSeleccionado),
                nombre_producto: producto.nombre,
                codigo_producto: producto.cod_producto,
                cantidad: cantidad,
                precio_unitario: precio,
                total: cantidad * precio,
            };

            setDetalles([...detalles, nuevoDetalle]);
        }

        // Limpiar campos
        setProductoSeleccionado('');
        setCantidad(1);
        setPrecio(0);
    };

    const eliminarDetalle = (id: string) => {
        const nuevosDetalles = detalles.filter((d) => d.id !== id);
        setDetalles(nuevosDetalles);
    };

    const calcularTotalVenta = () => {
        return detalles.reduce((total, detalle) => total + detalle.total, 0);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (detalles.length === 0) {
            alert('Debe agregar al menos un producto');
            return;
        }

        post('/ventas', {
            onSuccess: () => {
                reset();
                setDetalles([]);
            },
        });
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '📝 ¡Nueva Venta!',
                jóvenes: 'Nueva Venta',
                adultos: 'Registrar Nueva Venta',
            })}
        >
            <Head title="Registrar Venta" />

            <FormPage
                title={getTextByMode({
                    niños: '📝 ¡Vamos a hacer una nueva venta!',
                    jóvenes: 'Registrar Nueva Venta',
                    adultos: 'Registrar Nueva Venta',
                })}
                description={getTextByMode({
                    niños: '¡Aquí puedes crear una nueva venta con todos los productos que quieras!',
                    jóvenes: 'Registra una nueva venta agregando productos',
                    adultos: 'Complete el formulario para registrar una nueva venta',
                })}
                backHref="/ventas"
                backText={getTextByMode({
                    niños: '¡Volver a Ventas!',
                    jóvenes: 'Volver a Ventas',
                    adultos: 'Volver a Ventas',
                })}
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                            <h2 className={`mb-4 text-lg font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '📋 Datos de la Venta',
                                    jóvenes: 'Información de Venta',
                                    adultos: 'Información Básica',
                                })}
                            </h2>
                            <div className="space-y-4">
                                <InputField
                                    label={getTextByMode({
                                        niños: '📅 Fecha',
                                        jóvenes: 'Fecha',
                                        adultos: 'Fecha',
                                    })}
                                    type="date"
                                    value={data.fecha}
                                    onChange={(e) => setData('fecha', e.target.value)}
                                    error={errors.fecha}
                                />

                                <TextareaField
                                    label={getTextByMode({
                                        niños: '📝 Observaciones',
                                        jóvenes: 'Observaciones',
                                        adultos: 'Observaciones',
                                    })}
                                    value={data.observaciones}
                                    onChange={(e) => setData('observaciones', e.target.value)}
                                    rows={3}
                                    placeholder={getTextByMode({
                                        niños: 'Escribe aquí detalles adicionales',
                                        jóvenes: 'Detalles adicionales de la venta',
                                        adultos: 'Información adicional sobre la venta',
                                    })}
                                    error={errors.observaciones}
                                />

                                <div className="flex items-center">
                                    <input
                                        id="completar_automaticamente"
                                        type="checkbox"
                                        checked={data.completar_automaticamente}
                                        onChange={(e) => setData('completar_automaticamente', e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                                    />
                                    <label
                                        htmlFor="completar_automaticamente"
                                        className={`ml-2 block text-sm text-gray-700 dark:text-gray-300 ${getModeClasses()}`}
                                    >
                                        {getTextByMode({
                                            niños: '✅ ¡Completar venta automáticamente!',
                                            jóvenes: 'Completar venta al guardar',
                                            adultos: 'Marcar como completada y actualizar inventario',
                                        })}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                            <h2 className={`mb-4 text-lg font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🔍 Agregar Productos',
                                    jóvenes: 'Selección de Productos',
                                    adultos: 'Añadir Productos a la Venta',
                                })}
                            </h2>
                            <div className="space-y-4">
                                <InputField
                                    label={getTextByMode({
                                        niños: '🔍 Buscar Producto',
                                        jóvenes: 'Buscar',
                                        adultos: 'Buscar Producto',
                                    })}
                                    type="text"
                                    value={filtroBusqueda}
                                    onChange={(e) => setFiltroBusqueda(e.target.value)}
                                    placeholder={getTextByMode({
                                        niños: 'Escribe el nombre o código',
                                        jóvenes: 'Nombre, código o categoría',
                                        adultos: 'Buscar por nombre, código o categoría',
                                    })}
                                />

                                <SelectField
                                    label={getTextByMode({
                                        niños: '📦 Producto',
                                        jóvenes: 'Producto',
                                        adultos: 'Seleccionar Producto',
                                    })}
                                    value={productoSeleccionado.toString()}
                                    onChange={(e) => setProductoSeleccionado(e.target.value === '' ? '' : Number(e.target.value))}
                                    placeholder="Seleccione un producto"
                                    options={productosFiltrados.map(producto => ({
                                        value: producto.id.toString(),
                                        label: `${producto.nombre} - ${producto.cod_producto} (Stock: ${producto.stock_disponible})`
                                    }))}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <NumberField
                                        label={getTextByMode({
                                            niños: '🔢 Cantidad',
                                            jóvenes: 'Cantidad',
                                            adultos: 'Cantidad',
                                        })}
                                        value={cantidad.toString()}
                                        onChange={(e) => setCantidad(parseInt(e.target.value) || 0)}
                                        min={1}
                                    />

                                    <NumberField
                                        label={getTextByMode({
                                            niños: '💰 Precio',
                                            jóvenes: 'Precio',
                                            adultos: 'Precio Unitario',
                                        })}
                                        value={precio.toString()}
                                        onChange={(e) => setPrecio(parseFloat(e.target.value) || 0)}
                                        min={0}
                                        step="0.01"
                                    />
                                </div>

                                <div>
                                    <Button
                                        type="button"
                                        onClick={agregarDetalle}
                                        className="w-full"
                                    >
                                        {getTextByMode({
                                            niños: '➕ ¡Agregar a la lista!',
                                            jóvenes: 'Añadir Producto',
                                            adultos: 'Añadir a la Venta',
                                        })}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <h2 className={`mb-4 text-lg font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '📋 Lista de Productos',
                                jóvenes: 'Productos en la Venta',
                                adultos: 'Detalle de Productos',
                            })}
                        </h2>
                        {detalles.length === 0 ? (
                            <div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        {settings.ageMode === 'niños' ? (
                                            <span className="text-xl">📝</span>
                                        ) : (
                                            <svg
                                                className="h-5 w-5 text-yellow-400"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M8.485 3.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 3.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                            {getTextByMode({
                                                niños: '¡No hay productos todavía!',
                                                jóvenes: 'No hay productos',
                                                adultos: 'No hay productos seleccionados',
                                            })}
                                        </h3>
                                        <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                                            <p>
                                                {getTextByMode({
                                                    niños: 'Agrega productos usando el formulario de arriba.',
                                                    jóvenes: 'Utiliza el formulario superior para añadir productos.',
                                                    adultos: 'Seleccione productos utilizando el formulario superior para agregarlos a la venta.',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                                            >
                                                {getTextByMode({
                                                    niños: '📦 Producto',
                                                    jóvenes: 'Producto',
                                                    adultos: 'Producto',
                                                })}
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                                            >
                                                {getTextByMode({
                                                    niños: '🔢 Cantidad',
                                                    jóvenes: 'Cantidad',
                                                    adultos: 'Cantidad',
                                                })}
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                                            >
                                                {getTextByMode({
                                                    niños: '💰 Precio',
                                                    jóvenes: 'Precio',
                                                    adultos: 'Precio Unitario',
                                                })}
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                                            >
                                                {getTextByMode({
                                                    niños: '💵 Total',
                                                    jóvenes: 'Total',
                                                    adultos: 'Subtotal',
                                                })}
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400"
                                            >
                                                {getTextByMode({
                                                    niños: '🛠️ Acciones',
                                                    jóvenes: 'Acciones',
                                                    adultos: 'Acciones',
                                                })}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                        {detalles.map((detalle) => (
                                            <tr key={detalle.id}>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                                                    <div className="font-medium">{detalle.nombre_producto}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {detalle.codigo_producto}
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-900 dark:text-gray-100">
                                                    {detalle.cantidad}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-900 dark:text-gray-100">
                                                    {formatCurrency(detalle.precio_unitario)}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {formatCurrency(detalle.total)}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        onClick={() => eliminarDetalle(detalle.id)}
                                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                    >
                                                        {settings.ageMode === 'niños' ? '🗑️' : 'Eliminar'}
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <td colSpan={3} className="px-6 py-4 text-right text-sm font-bold text-gray-900 dark:text-white">
                                                {getTextByMode({
                                                    niños: '💰 TOTAL VENTA:',
                                                    jóvenes: 'TOTAL:',
                                                    adultos: 'TOTAL DE LA VENTA:',
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-bold text-green-600 dark:text-green-400">
                                                {formatCurrency(calcularTotalVenta())}
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
                    </div>

                    <FormButtons
                        isProcessing={processing || detalles.length === 0}
                        submitLabel={getTextByMode({
                            niños: '💾 ¡Guardar Venta!',
                            jóvenes: 'Registrar Venta',
                            adultos: 'Registrar Venta',
                        })}
                        cancelHref="/ventas"
                        cancelLabel={getTextByMode({
                            niños: '❌ ¡Cancelar!',
                            jóvenes: 'Cancelar',
                            adultos: 'Cancelar',
                        })}
                    />
                </form>
            </FormPage>
        </DashboardLayout>
    );
}
