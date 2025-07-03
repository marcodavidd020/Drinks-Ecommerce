import { Head, Link, useForm } from '@inertiajs/react';
import { useAppMode } from '@/contexts/AppModeContext';
import AppLayout from '@/layouts/AppLayout';
import { formatCurrency } from '@/lib/currency';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Producto {
    id: number;
    cod_producto: string;
    nombre: string;
    descripcion?: string;
    precio_compra: number;
    precio_venta: number;
    imagen?: string;
    categoria: {
        id: number;
        nombre: string;
    };
    stock_total: number;
}

interface Promocion {
    id: number;
    nombre: string;
    descuento: number;
}

interface ProductDetailProps {
    producto: Producto;
    promociones: Promocion[];
    productosRelacionados: Producto[];
    isAuthenticated: boolean;
    carritoCount: number;
}

export default function ProductDetail({ 
    producto, 
    promociones, 
    productosRelacionados, 
    isAuthenticated,
    carritoCount 
}: ProductDetailProps) {
    const { settings } = useAppMode();
    const [cantidad, setCantidad] = useState(1);

    const { setData, post, processing } = useForm({
        producto_id: producto.id,
        cantidad: 1,
    });

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

    const getDefaultImage = (prod: Producto) => {
        const categoria = prod.categoria?.nombre.toLowerCase() || '';
        
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

    const getStockStatus = (stock: number) => {
        if (stock === 0) {
            return {
                text: getTextByMode({
                    niños: '😢 Agotado',
                    jóvenes: '❌ Agotado',
                    adultos: 'Sin Stock'
                }),
                color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
                available: false
            };
        } else if (stock < 10) {
            return {
                text: getTextByMode({
                    niños: '⚠️ Pocas unidades',
                    jóvenes: '⚠️ Stock Limitado',
                    adultos: 'Stock Limitado'
                }),
                color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
                available: true
            };
        } else {
            return {
                text: getTextByMode({
                    niños: '✅ Disponible',
                    jóvenes: '✅ Disponible',
                    adultos: 'En Stock'
                }),
                color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
                available: true
            };
        }
    };

    const handleAgregarAlCarrito = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isAuthenticated) {
            // Redirigir al login si no está autenticado
            window.location.href = '/login';
            return;
        }

        setData('cantidad', cantidad);
        post('/carrito/agregar');
    };

    const stockStatus = getStockStatus(producto.stock_total);
    const productImage = producto.imagen || getDefaultImage(producto);

    return (
        <AppLayout showNavbar={true} showModeSelector={true}>
            <Head title={`${producto.nombre} - Detalles del Producto`} />

            <div className={`min-h-screen py-8 ${getModeClasses()}`}>
                <div className="container mx-auto px-4">
                    {/* Breadcrumb */}
                    <nav className="flex mb-8">
                        <ol className="inline-flex items-center space-x-1 md:space-x-3">
                            <li className="inline-flex items-center">
                                <Link href="/" className="text-blue-600 hover:text-blue-800">
                                    {getTextByMode({
                                        niños: '🏠 Inicio',
                                        jóvenes: '🏠 Home',
                                        adultos: 'Inicio'
                                    })}
                                </Link>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <span className="mx-2">/</span>
                                    <span className="text-gray-500">{producto.categoria.nombre}</span>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-center">
                                    <span className="mx-2">/</span>
                                    <span className="text-gray-700 font-medium">{producto.nombre}</span>
                                </div>
                            </li>
                        </ol>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Imagen del producto */}
                        <div className="space-y-4">
                            <div className="aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
                                <img
                                    src={productImage}
                                    alt={producto.nombre}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = getDefaultImage(producto);
                                    }}
                                />
                            </div>
                        </div>

                        {/* Información del producto */}
                        <div className="space-y-6">
                            {/* Categoría */}
                            <div>
                                <Badge variant="secondary" className="text-sm">
                                    {producto.categoria.nombre}
                                </Badge>
                            </div>

                            {/* Título */}
                            <h1 className={`text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                {producto.nombre}
                            </h1>

                            {/* Código */}
                            <p className="text-gray-600 dark:text-gray-400">
                                {getTextByMode({
                                    niños: '🔢 Código:',
                                    jóvenes: 'SKU:',
                                    adultos: 'Código:'
                                })} {producto.cod_producto}
                            </p>

                            {/* Precio */}
                            <div className="flex items-baseline space-x-4">
                                <span className={`text-4xl font-bold text-blue-600 dark:text-blue-400 ${getModeClasses()}`}>
                                    {formatCurrency(producto.precio_venta)}
                                </span>
                                {promociones.length > 0 && (
                                    <span className="text-lg text-gray-500 line-through">
                                        {formatCurrency(producto.precio_venta * 1.2)}
                                    </span>
                                )}
                            </div>

                            {/* Promociones */}
                            {promociones.length > 0 && (
                                <div className="space-y-2">
                                    <h3 className={`font-semibold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '🎉 ¡Ofertas Especiales!',
                                            jóvenes: '🔥 Promociones',
                                            adultos: 'Promociones Activas'
                                        })}
                                    </h3>
                                    {promociones.map((promocion) => (
                                        <Badge key={promocion.id} variant="destructive">
                                            {promocion.nombre} - {promocion.descuento}% OFF
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {/* Stock */}
                            <div className="flex items-center space-x-3">
                                <Badge className={stockStatus.color}>
                                    {stockStatus.text}
                                </Badge>
                                <span className="text-gray-600 dark:text-gray-400">
                                    {producto.stock_total} {getTextByMode({
                                        niños: 'disponibles',
                                        jóvenes: 'en stock',
                                        adultos: 'unidades disponibles'
                                    })}
                                </span>
                            </div>

                            {/* Descripción */}
                            {producto.descripcion && (
                                <div className="space-y-2">
                                    <h3 className={`font-semibold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '📝 ¿Qué es este producto?',
                                            jóvenes: '📝 Descripción',
                                            adultos: 'Descripción'
                                        })}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {producto.descripcion}
                                    </p>
                                </div>
                            )}

                            {/* Formulario de agregar al carrito */}
                            {stockStatus.available && (
                                <form onSubmit={handleAgregarAlCarrito} className="space-y-4">
                                    <div className="flex items-center space-x-4">
                                        <label className={`font-medium text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                            {getTextByMode({
                                                niños: '🔢 ¿Cuántos quieres?',
                                                jóvenes: '🔢 Cantidad',
                                                adultos: 'Cantidad:'
                                            })}
                                        </label>
                                        <Input
                                            type="number"
                                            min="1"
                                            max={producto.stock_total}
                                            value={cantidad}
                                            onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                                            className="w-20"
                                        />
                                    </div>

                                    <div className="flex space-x-4">
                                        <Button 
                                            type="submit" 
                                            disabled={processing}
                                            className={`flex-1 py-3 text-lg font-semibold ${getModeClasses()}`}
                                        >
                                            {processing ? (
                                                getTextByMode({
                                                    niños: '⏳ Agregando...',
                                                    jóvenes: '⏳ Agregando...',
                                                    adultos: 'Agregando...'
                                                })
                                            ) : (
                                                getTextByMode({
                                                    niños: '🛒 ¡Agregar al Carrito!',
                                                    jóvenes: '🛒 Agregar al Carrito',
                                                    adultos: 'Agregar al Carrito'
                                                })
                                            )}
                                        </Button>

                                        {isAuthenticated && carritoCount > 0 && (
                                            <Link href="/carrito">
                                                <Button variant="outline" className="py-3">
                                                    {getTextByMode({
                                                        niños: `🛒 Ver Carrito (${carritoCount})`,
                                                        jóvenes: `🛒 Carrito (${carritoCount})`,
                                                        adultos: `Ver Carrito (${carritoCount})`
                                                    })}
                                                </Button>
                                            </Link>
                                        )}
                                    </div>

                                    {!isAuthenticated && (
                                        <p className={`text-sm text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                            {getTextByMode({
                                                niños: '💡 ¡Necesitas hacer login para comprar!',
                                                jóvenes: '💡 Inicia sesión para comprar',
                                                adultos: 'Inicie sesión para realizar compras'
                                            })}
                                        </p>
                                    )}
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Productos relacionados */}
                    {productosRelacionados.length > 0 && (
                        <div className="mt-16">
                            <h2 className={`text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '🎯 ¡Otros productos geniales!',
                                    jóvenes: '🎯 También te puede interesar',
                                    adultos: 'Productos Relacionados'
                                })}
                            </h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                                {productosRelacionados.map((prodRelacionado) => (
                                    <Link
                                        key={prodRelacionado.id}
                                        href={`/product/${prodRelacionado.id}`}
                                        className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                                    >
                                        <div className="aspect-square overflow-hidden">
                                            <img
                                                src={prodRelacionado.imagen || getDefaultImage(prodRelacionado)}
                                                alt={prodRelacionado.nombre}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className={`font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 ${getModeClasses()}`}>
                                                {prodRelacionado.nombre}
                                            </h3>
                                            <p className={`text-lg font-bold text-blue-600 dark:text-blue-400 ${getModeClasses()}`}>
                                                {formatCurrency(prodRelacionado.precio_venta)}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
} 