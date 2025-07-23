import React, { useState, useEffect, FormEvent } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    Trash2, 
    Plus, 
    Save, 
    RotateCcw, 
    X, 
    AlertCircle, 
    ShoppingCart, 
    User, 
    Calendar, 
    FileText,
    Package,
    DollarSign,
    TrendingUp,
    CheckCircle,
    Clock,
    ArrowLeft
} from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppModeText } from '@/hooks/useAppModeText';
import { formatCurrency } from '@/lib/currency';

interface Producto {
    id: number;
    nombre: string;
    cod_producto: string;
    precio_venta: number;
    stock_disponible: number;
    categoria?: {
        id: number;
        nombre: string;
    };
}

interface Cliente {
    id: number;
    nombre: string;
    email: string;
    nit?: string;
}

interface DetalleVenta {
    id?: number;
    producto_id: number;
    producto: Producto;
    cantidad: number;
    total: number;
}

interface Venta {
    id: number;
    cliente_id: number;
    fecha: string;
    estado: string;
    observaciones?: string;
    total: number;
    detalles: DetalleVenta[];
    cliente: Cliente;
}

interface VentaEditProps {
    venta: Venta;
    productos: Producto[];
    clientes: Cliente[];
}

export default function VentaEdit({ venta, productos, clientes }: VentaEditProps) {
    const { getTextByMode, getModeClasses } = useAppModeText();
    const [detalles, setDetalles] = useState<DetalleVenta[]>(venta.detalles);
    const [productoSeleccionado, setProductoSeleccionado] = useState<string>('');
    const [cantidad, setCantidad] = useState<number>(1);
    const [hasChanges, setHasChanges] = useState<boolean>(false);
    const [isRecalculating, setIsRecalculating] = useState<boolean>(false);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    const { data, setData, put, processing, errors } = useForm({
        cliente_id: venta.cliente_id.toString(),
        fecha: venta.fecha,
        observaciones: venta.observaciones || '',
        detalles: detalles,
    });

    // Detectar cambios
    useEffect(() => {
        const hasDataChanges = 
            data.cliente_id !== venta.cliente_id.toString() ||
            data.fecha !== venta.fecha ||
            data.observaciones !== (venta.observaciones || '') ||
            JSON.stringify(data.detalles) !== JSON.stringify(venta.detalles);
        
        setHasChanges(hasDataChanges);
    }, [data, venta]);

    // Actualizar detalles en el formulario cuando cambien
    useEffect(() => {
        setData('detalles', detalles);
    }, [detalles]);

    const handleProductoChange = (productId: string) => {
        setProductoSeleccionado(productId);
        const producto = productos.find(p => p.id === parseInt(productId));
        if (producto) {
            setCantidad(1);
        }
    };

    const agregarProducto = () => {
        if (!productoSeleccionado) {
            alert('Debe seleccionar un producto');
            return;
        }

        const producto = productos.find(p => p.id === parseInt(productoSeleccionado));
        if (!producto) return;

        // Verificar si el producto ya está en los detalles
        const productoExistente = detalles.find(d => d.producto_id === producto.id);
        if (productoExistente) {
            alert('Este producto ya está en la venta');
            return;
        }

        // Verificar stock disponible
        if (cantidad > producto.stock_disponible) {
            alert(`Stock insuficiente. Disponible: ${producto.stock_disponible}`);
            return;
        }

        const nuevoDetalle: DetalleVenta = {
            producto_id: producto.id,
            producto: producto,
            cantidad: cantidad,
            total: producto.precio_venta * cantidad,
        };

        setDetalles([...detalles, nuevoDetalle]);
        setProductoSeleccionado('');
        setCantidad(1);
    };

    const eliminarProducto = (index: number) => {
        setDetalles(detalles.filter((_, i) => i !== index));
    };

    const actualizarCantidad = (index: number, nuevaCantidad: number) => {
        if (nuevaCantidad <= 0) return;

        const detalle = detalles[index];
        const producto = productos.find(p => p.id === detalle.producto_id);
        
        if (producto && nuevaCantidad > producto.stock_disponible) {
            alert(`Stock insuficiente. Disponible: ${producto.stock_disponible}`);
            return;
        }

        const nuevosDetalles = [...detalles];
        nuevosDetalles[index] = {
            ...detalle,
            cantidad: nuevaCantidad,
            total: detalle.producto.precio_venta * nuevaCantidad,
        };

        setDetalles(nuevosDetalles);
    };

    const recalcularTotales = () => {
        setIsRecalculating(true);
        
        const nuevosDetalles = detalles.map(detalle => ({
            ...detalle,
            total: detalle.producto.precio_venta * detalle.cantidad,
        }));

        setDetalles(nuevosDetalles);
        
        setTimeout(() => {
            setIsRecalculating(false);
        }, 500);
    };

    const cancelarCambios = () => {
        if (hasChanges && !confirm('¿Está seguro de cancelar los cambios?')) {
            return;
        }
        
        router.visit(`/ventas/${venta.id}`);
    };

    const calcularSubtotal = () => {
        return detalles.reduce((total, detalle) => total + detalle.total, 0);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!data.cliente_id) {
            alert('Debe seleccionar un cliente');
            return;
        }

        if (detalles.length === 0) {
            alert('Debe agregar al menos un producto');
            return;
        }

        put(`/ventas/${venta.id}`, {
            onSuccess: () => {
                setHasChanges(false);
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            },
        });
    };

    const title = getTextByMode({
        niños: `✏️ Editando Venta #${venta.id}`,
        jóvenes: `✏️ Editar Venta #${venta.id}`,
        adultos: `Editar Venta #${venta.id}`,
    });

    return (
        <DashboardLayout title={title}>
            <Head title={title} />

            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4 py-8">
                    {/* Header con navegación */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <Button
                                variant="ghost"
                                onClick={() => router.visit(`/ventas/${venta.id}`)}
                                className="hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver
                            </Button>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                <ShoppingCart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h1 className={`text-4xl font-bold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                    {title}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 text-lg">
                                    {getTextByMode({
                                        niños: '¡Modifica los detalles de la venta!',
                                        jóvenes: 'Edita los detalles de la venta',
                                        adultos: 'Modifique los detalles de la venta según sea necesario',
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Alerta de estado */}
                    <Card className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20 shadow-sm">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-full">
                                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-amber-800 dark:text-amber-200 font-medium">
                                        {getTextByMode({
                                            niños: '¡Solo puedes editar ventas pendientes!',
                                            jóvenes: 'Solo se pueden editar ventas en estado pendiente',
                                            adultos: 'Solo se pueden editar ventas que estén en estado pendiente',
                                        })}
                                    </p>
                                    <p className="text-amber-700 dark:text-amber-300 text-sm mt-1">
                                        Estado actual: <Badge variant="outline" className="ml-1">{venta.estado}</Badge>
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Mensaje de éxito */}
                    {showSuccess && (
                        <Card className="mb-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20 shadow-sm">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-full">
                                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <p className="text-green-800 dark:text-green-200 font-medium">
                                        ¡Venta actualizada correctamente!
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                            {/* Columna izquierda - Información básica */}
                            <div className="xl:col-span-3 space-y-8">
                                {/* Información básica */}
                                <Card className="shadow-sm border-0 bg-white dark:bg-gray-800">
                                    <CardHeader className="bg-gray-50 dark:bg-gray-700 border-b">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <CardTitle className={`text-xl text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                                    {getTextByMode({
                                                        niños: '📋 Información de la Venta',
                                                        jóvenes: 'Información de la Venta',
                                                        adultos: 'Información de la Venta',
                                                    })}
                                                </CardTitle>
                                                <CardDescription className="text-gray-600 dark:text-gray-400">
                                                    Datos básicos de la venta
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-6">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="cliente_id" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    {getTextByMode({
                                                        niños: '👤 Cliente',
                                                        jóvenes: 'Cliente',
                                                        adultos: 'Cliente',
                                                    })}
                                                </Label>
                                                <Select
                                                    value={data.cliente_id}
                                                    onValueChange={(value) => setData('cliente_id', value)}
                                                >
                                                    <SelectTrigger className="h-12 border-2 focus:border-blue-500 transition-colors bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                                                        <SelectValue placeholder="Seleccionar cliente" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {clientes.map((cliente) => (
                                                            <SelectItem key={cliente.id} value={cliente.id.toString()}>
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium">{cliente.nombre}</span>
                                                                    <span className="text-sm text-muted-foreground">{cliente.email}</span>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.cliente_id && (
                                                    <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {errors.cliente_id}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="fecha" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                    <Calendar className="h-4 w-4" />
                                                    {getTextByMode({
                                                        niños: '📅 Fecha de Venta',
                                                        jóvenes: 'Fecha de Venta',
                                                        adultos: 'Fecha de Venta',
                                                    })}
                                                </Label>
                                                <Input
                                                    type="date"
                                                    value={data.fecha}
                                                    onChange={(e) => setData('fecha', e.target.value)}
                                                    className="h-12 border-2 focus:border-blue-500 transition-colors bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                                />
                                                {errors.fecha && (
                                                    <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" />
                                                        {errors.fecha}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="observaciones" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                {getTextByMode({
                                                    niños: '📝 Observaciones',
                                                    jóvenes: 'Observaciones',
                                                    adultos: 'Observaciones',
                                                })}
                                            </Label>
                                            <textarea
                                                value={data.observaciones}
                                                onChange={(e) => setData('observaciones', e.target.value)}
                                                placeholder={getTextByMode({
                                                    niños: 'Ej: entrega a domicilio, pago contra entrega...',
                                                    jóvenes: 'Ej: entrega a domicilio, pago contra entrega...',
                                                    adultos: 'Ej: entrega a domicilio, pago contra entrega...',
                                                })}
                                                rows={4}
                                                className="flex w-full rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20 transition-all duration-200 resize-none"
                                            />
                                            {errors.observaciones && (
                                                <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" />
                                                    {errors.observaciones}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Productos */}
                                <Card className="shadow-sm border-0 bg-white dark:bg-gray-800">
                                    <CardHeader className="bg-gray-50 dark:bg-gray-700 border-b">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                                                <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <CardTitle className={`text-xl text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                                    {getTextByMode({
                                                        niños: '🛍️ Productos de la Venta',
                                                        jóvenes: 'Productos de la Venta',
                                                        adultos: 'Productos de la Venta',
                                                    })}
                                                </CardTitle>
                                                <CardDescription className="text-gray-600 dark:text-gray-400">
                                                    {getTextByMode({
                                                        niños: '¡Agrega o quita productos!',
                                                        jóvenes: 'Agrega o elimina productos de la venta',
                                                        adultos: 'Agregue o elimine productos de la venta',
                                                    })}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        {/* Agregar producto */}
                                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                                    <Package className="h-4 w-4" />
                                                    {getTextByMode({
                                                        niños: '🍹 Producto',
                                                        jóvenes: 'Producto',
                                                        adultos: 'Producto',
                                                    })}
                                                </Label>
                                                <Select value={productoSeleccionado} onValueChange={handleProductoChange}>
                                                    <SelectTrigger className="h-12 border-2 focus:border-green-500 transition-colors bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                                                        <SelectValue placeholder="Seleccionar producto" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {productos.map((producto) => (
                                                            <SelectItem key={producto.id} value={producto.id.toString()}>
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium">{producto.nombre}</span>
                                                                    <span className="text-sm text-muted-foreground">
                                                                        Stock: {producto.stock_disponible} | {formatCurrency(producto.precio_venta)}
                                                                    </span>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {getTextByMode({
                                                        niños: '🔢 Cantidad',
                                                        jóvenes: 'Cantidad',
                                                        adultos: 'Cantidad',
                                                    })}
                                                </Label>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={cantidad}
                                                    onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                                                    className="h-12 border-2 focus:border-green-500 transition-colors bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                                />
                                            </div>

                                            <div className="flex items-end">
                                                <Button
                                                    type="button"
                                                    onClick={agregarProducto}
                                                    className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                                    disabled={!productoSeleccionado}
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    {getTextByMode({
                                                        niños: 'Agregar',
                                                        jóvenes: 'Agregar',
                                                        adultos: 'Agregar',
                                                    })}
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Lista de productos */}
                                        <div className="space-y-4">
                                            {detalles.map((detalle, index) => (
                                                <div
                                                    key={index}
                                                    className="group flex items-center justify-between p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 shadow-sm hover:shadow-md"
                                                >
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                                                <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{detalle.producto.nombre}</h4>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <Badge variant="secondary" className="text-xs">
                                                                        {detalle.producto.cod_producto}
                                                                    </Badge>
                                                                    {detalle.producto.categoria && (
                                                                        <Badge variant="outline" className="text-xs">
                                                                            {detalle.producto.categoria.nombre}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                            <span className="flex items-center gap-1">
                                                                <DollarSign className="h-3 w-3" />
                                                                Precio: {formatCurrency(detalle.producto.precio_venta)}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <TrendingUp className="h-3 w-3" />
                                                                Total: {formatCurrency(detalle.total)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cantidad:</Label>
                                                            <Input
                                                                type="number"
                                                                min="1"
                                                                value={detalle.cantidad}
                                                                onChange={(e) => actualizarCantidad(index, parseInt(e.target.value) || 1)}
                                                                className="w-20 h-10 border-2 focus:border-blue-500 transition-colors bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                                                            />
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => eliminarProducto(index)}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}

                                            {detalles.length === 0 && (
                                                <div className="text-center py-12">
                                                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                                        <Package className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                                                    </div>
                                                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                                                        {getTextByMode({
                                                            niños: '¡No hay productos en la venta!',
                                                            jóvenes: 'No hay productos en la venta',
                                                            adultos: 'No hay productos en la venta',
                                                        })}
                                                    </p>
                                                    <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                                                        Agrega productos usando el formulario de arriba
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Columna derecha - Resumen y acciones */}
                            <div className="space-y-6">
                                {/* Resumen */}
                                <Card className="shadow-sm border-0 bg-white dark:bg-gray-800 sticky top-6">
                                    <CardHeader className="bg-blue-50 dark:bg-blue-900/20 border-b">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                                <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <CardTitle className={`text-xl text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                                    {getTextByMode({
                                                        niños: '💰 Resumen',
                                                        jóvenes: 'Resumen',
                                                        adultos: 'Resumen',
                                                    })}
                                                </CardTitle>
                                                <CardDescription className="text-gray-600 dark:text-gray-400">
                                                    Total de la venta
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-4">
                                        <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {getTextByMode({
                                                    niños: 'Subtotal',
                                                    jóvenes: 'Subtotal',
                                                    adultos: 'Subtotal',
                                                })}
                                            </span>
                                            <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">{formatCurrency(calcularSubtotal())}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-3">
                                            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                                {getTextByMode({
                                                    niños: 'Total',
                                                    jóvenes: 'Total',
                                                    adultos: 'Total',
                                                })}
                                            </span>
                                            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                {formatCurrency(calcularSubtotal())}
                                            </span>
                                        </div>
                                        <div className="text-center py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                            <p className="text-sm text-green-700 dark:text-green-300">
                                                {detalles.length} producto{detalles.length !== 1 ? 's' : ''} en la venta
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Acciones */}
                                <Card className="shadow-sm border-0 bg-white dark:bg-gray-800">
                                    <CardHeader className="bg-gray-50 dark:bg-gray-700 border-b">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                                                <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <CardTitle className={`text-xl text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                                {getTextByMode({
                                                    niños: '⚡ Acciones',
                                                    jóvenes: 'Acciones',
                                                    adultos: 'Acciones',
                                                })}
                                            </CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-4">
                                        <Button
                                            type="submit"
                                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={processing || !hasChanges}
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            {getTextByMode({
                                                niños: '💾 Guardar Cambios',
                                                jóvenes: '💾 Guardar Cambios',
                                                adultos: '💾 Guardar Cambios',
                                            })}
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full h-12 border-2 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
                                            onClick={recalcularTotales}
                                            disabled={isRecalculating}
                                        >
                                            <RotateCcw className={`h-4 w-4 mr-2 ${isRecalculating ? 'animate-spin' : ''}`} />
                                            {getTextByMode({
                                                niños: '🔄 Recalcular Totales',
                                                jóvenes: '🔄 Recalcular Totales',
                                                adultos: '🔄 Recalcular Totales',
                                            })}
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="destructive"
                                            className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                                            onClick={cancelarCambios}
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            {getTextByMode({
                                                niños: '❌ Cancelar Cambios',
                                                jóvenes: '❌ Cancelar Cambios',
                                                adultos: '❌ Cancelar Cambios',
                                            })}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
} 