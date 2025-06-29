import { Head, Link, useForm } from '@inertiajs/react';
import { useAppMode } from '@/contexts/AppModeContext';
import AppLayout from '@/layouts/AppLayout';
import { formatCurrency } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

interface Producto {
    id: number;
    cod_producto: string;
    nombre: string;
    precio_venta: number;
    imagen?: string;
    categoria: {
        id: number;
        nombre: string;
    };
}

interface DetalleCarrito {
    id: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    producto: Producto;
}

interface Carrito {
    id: number;
    total: number;
    fecha: string;
}

interface CarritoIndexProps {
    carrito: Carrito | null;
    detalles: DetalleCarrito[];
    total: number;
}

export default function CarritoIndex({ carrito, detalles, total }: CarritoIndexProps) {
    const { settings } = useAppMode();
    const [cantidades, setCantidades] = useState<{ [key: number]: number }>({});

    const { data, setData, patch, delete: destroy, post, processing } = useForm();

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

    const getDefaultImage = (producto: Producto) => {
        const categoria = producto.categoria?.nombre.toLowerCase() || '';
        
        const categoryImages: { [key: string]: string } = {
            'tecnología': 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop',
            'electrónicos': 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop',
            'deportes': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
            'música': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
            'libros': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
            'ropa': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop',
            'hogar': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
            'juguetes': 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=300&fit=crop',
            'cocina': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
            'automóviles': 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400&h=300&fit=crop'
        };

        for (const [key, image] of Object.entries(categoryImages)) {
            if (categoria.includes(key)) {
                return image;
            }
        }

        return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop';
    };

    const handleActualizarCantidad = (detalleId: number, nuevaCantidad: number) => {
        patch(`/carrito/actualizar/${detalleId}`, {
            data: { cantidad: nuevaCantidad },
            preserveScroll: true,
        });
    };

    const handleEliminarProducto = (detalleId: number) => {
        if (confirm(getTextByMode({
            niños: '¿Seguro que quieres quitar este producto de tu carrito?',
            jóvenes: '¿Eliminar este producto del carrito?',
            adultos: '¿Está seguro de que desea eliminar este producto del carrito?'
        }))) {
            destroy(`/carrito/eliminar/${detalleId}`, {
                preserveScroll: true,
            });
        }
    };

    const handleCheckout = () => {
        if (confirm(getTextByMode({
            niños: '¿Listo para finalizar tu compra? ¡Vamos a pagar!',
            jóvenes: '¿Proceder al checkout?',
            adultos: '¿Desea proceder con la compra?'
        }))) {
            post('/carrito/checkout');
        }
    };

    return (
        <AppLayout showNavbar={true} showModeSelector={true}>
            <Head title={getTextByMode({
                niños: '🛒 Mi Carrito de Compras',
                jóvenes: '🛒 Carrito de Compras',
                adultos: 'Carrito de Compras'
            })} />

            <div className={`min-h-screen py-8 ${getModeClasses()}`}>
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h1 className={`text-3xl font-bold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '🛒 Mi Carrito Súper Genial',
                                jóvenes: '🛒 Mi Carrito',
                                adultos: 'Carrito de Compras'
                            })}
                        </h1>
                        <Link href="/">
                            <Button variant="outline">
                                {getTextByMode({
                                    niños: '🏠 Seguir Comprando',
                                    jóvenes: '🏠 Continuar Comprando',
                                    adultos: 'Continuar Comprando'
                                })}
                            </Button>
                        </Link>
                    </div>

                    {detalles.length === 0 ? (
                        /* Carrito vacío */
                        <div className="text-center py-16">
                            <div className="text-8xl mb-6">
                                {settings.ageMode === 'niños' ? '😢' : '🛒'}
                            </div>
                            <h2 className={`text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '¡Tu carrito está vacío!',
                                    jóvenes: 'Tu carrito está vacío',
                                    adultos: 'Su carrito está vacío'
                                })}
                            </h2>
                            <p className={`text-gray-600 dark:text-gray-400 mb-8 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '¡Vamos a buscar productos súper geniales para agregar!',
                                    jóvenes: 'Explora nuestros productos y agrega los que te gusten',
                                    adultos: 'Explore nuestro catálogo y agregue productos a su carrito'
                                })}
                            </p>
                            <Link href="/">
                                <Button size="lg" className={getModeClasses()}>
                                    {getTextByMode({
                                        niños: '🚀 ¡Ir de Compras!',
                                        jóvenes: '🛍️ Ir de Compras',
                                        adultos: 'Explorar Productos'
                                    })}
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Lista de productos */}
                            <div className="lg:col-span-2 space-y-4">
                                {detalles.map((detalle) => (
                                    <Card key={detalle.id} className="overflow-hidden">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row gap-4">
                                                {/* Imagen del producto */}
                                                <div className="flex-shrink-0">
                                                    <Link href={`/product/${detalle.producto.id}`}>
                                                        <img
                                                            src={detalle.producto.imagen || getDefaultImage(detalle.producto)}
                                                            alt={detalle.producto.nombre}
                                                            className="w-24 h-24 object-cover rounded-lg hover:scale-105 transition-transform"
                                                        />
                                                    </Link>
                                                </div>

                                                {/* Información del producto */}
                                                <div className="flex-1">
                                                    <Link 
                                                        href={`/product/${detalle.producto.id}`}
                                                        className="hover:text-blue-600 transition-colors"
                                                    >
                                                        <h3 className={`font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2 ${getModeClasses()}`}>
                                                            {detalle.producto.nombre}
                                                        </h3>
                                                    </Link>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                        {getTextByMode({
                                                            niños: '🏷️ Código:',
                                                            jóvenes: 'SKU:',
                                                            adultos: 'Código:'
                                                        })} {detalle.producto.cod_producto}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                        {getTextByMode({
                                                            niños: '📂 Categoría:',
                                                            jóvenes: 'Categoría:',
                                                            adultos: 'Categoría:'
                                                        })} {detalle.producto.categoria.nombre}
                                                    </p>

                                                    {/* Controles de cantidad y precio */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-2">
                                                            <label className={`text-sm font-medium ${getModeClasses()}`}>
                                                                {getTextByMode({
                                                                    niños: '🔢 Cantidad:',
                                                                    jóvenes: 'Cantidad:',
                                                                    adultos: 'Cantidad:'
                                                                })}
                                                            </label>
                                                            <Input
                                                                type="number"
                                                                min="1"
                                                                value={cantidades[detalle.id] || detalle.cantidad}
                                                                onChange={(e) => {
                                                                    const nuevaCantidad = parseInt(e.target.value) || 1;
                                                                    setCantidades(prev => ({
                                                                        ...prev,
                                                                        [detalle.id]: nuevaCantidad
                                                                    }));
                                                                }}
                                                                onBlur={() => {
                                                                    const nuevaCantidad = cantidades[detalle.id];
                                                                    if (nuevaCantidad && nuevaCantidad !== detalle.cantidad) {
                                                                        handleActualizarCantidad(detalle.id, nuevaCantidad);
                                                                    }
                                                                }}
                                                                className="w-20"
                                                            />
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleEliminarProducto(detalle.id)}
                                                                className="text-red-600 hover:text-red-800"
                                                            >
                                                                {getTextByMode({
                                                                    niños: '🗑️ Quitar',
                                                                    jóvenes: '🗑️ Eliminar',
                                                                    adultos: 'Eliminar'
                                                                })}
                                                            </Button>
                                                        </div>

                                                        <div className="text-right">
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                {formatCurrency(detalle.precio_unitario)} c/u
                                                            </p>
                                                            <p className={`text-lg font-bold text-blue-600 dark:text-blue-400 ${getModeClasses()}`}>
                                                                {formatCurrency(detalle.subtotal)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Resumen del carrito */}
                            <div className="lg:col-span-1">
                                <Card className="sticky top-4">
                                    <CardHeader>
                                        <CardTitle className={`text-xl ${getModeClasses()}`}>
                                            {getTextByMode({
                                                niños: '💰 Resumen de mi Compra',
                                                jóvenes: '💰 Resumen del Pedido',
                                                adultos: 'Resumen del Pedido'
                                            })}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className={getModeClasses()}>
                                                {getTextByMode({
                                                    niños: '📦 Productos:',
                                                    jóvenes: 'Productos:',
                                                    adultos: 'Productos:'
                                                })}
                                            </span>
                                            <span>{detalles.length}</span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className={getModeClasses()}>
                                                {getTextByMode({
                                                    niños: '🔢 Total unidades:',
                                                    jóvenes: 'Cantidad total:',
                                                    adultos: 'Cantidad total:'
                                                })}
                                            </span>
                                            <span>{detalles.reduce((acc, det) => acc + det.cantidad, 0)}</span>
                                        </div>

                                        <hr className="my-4" />

                                        <div className="flex justify-between text-lg font-bold">
                                            <span className={getModeClasses()}>
                                                {getTextByMode({
                                                    niños: '💰 Total a pagar:',
                                                    jóvenes: 'Total:',
                                                    adultos: 'Total:'
                                                })}
                                            </span>
                                            <span className="text-blue-600 dark:text-blue-400">
                                                {formatCurrency(total)}
                                            </span>
                                        </div>

                                        <Button 
                                            onClick={handleCheckout}
                                            disabled={processing}
                                            className={`w-full py-3 text-lg font-semibold ${getModeClasses()}`}
                                            size="lg"
                                        >
                                            {processing ? (
                                                getTextByMode({
                                                    niños: '⏳ Procesando...',
                                                    jóvenes: '⏳ Procesando...',
                                                    adultos: 'Procesando...'
                                                })
                                            ) : (
                                                getTextByMode({
                                                    niños: '🎉 ¡Finalizar Compra!',
                                                    jóvenes: '💳 Finalizar Compra',
                                                    adultos: 'Proceder al Checkout'
                                                })
                                            )}
                                        </Button>

                                        <p className={`text-xs text-gray-600 dark:text-gray-400 text-center ${getModeClasses()}`}>
                                            {getTextByMode({
                                                niños: '✨ ¡Tu compra será procesada súper rápido!',
                                                jóvenes: '✅ Compra segura y confiable',
                                                adultos: 'Compra segura y protegida'
                                            })}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
} 