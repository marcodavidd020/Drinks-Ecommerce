import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';

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
    promociones?: Array<{
        id: number;
        nombre: string;
        descuento: number;
    }>;
    inventarios?: Array<{
        id: number;
        stock: number;
        almacen: {
            id: number;
            nombre: string;
        };
    }>;
    stock_total?: number;
    created_at: string;
    updated_at: string;
}

interface ProductoShowProps {
    producto: Producto;
}

export default function ProductoShow({ producto }: ProductoShowProps) {
    const { settings } = useAppMode();

    const getTextByMode = (textos: { niños: string; jóvenes: string; adultos: string }) => {
        return textos[settings.ageMode] || textos.adultos;
    };

    const getModeClasses = () => {
        const baseClasses = 'transition-all duration-300';
        switch (settings.ageMode) {
            case 'niños':
                return 'font-comic text-adaptive-kids';
            case 'jóvenes':
                return 'font-modern text-adaptive-teen';
            default:
                return 'font-classic text-adaptive-adult';
        }
    };

    const formatPrice = (precio: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
        }).format(precio);
    };

    const getStockTotal = () => {
        if (producto.stock_total !== undefined) {
            return producto.stock_total;
        }
        return producto.inventarios?.reduce((total, inv) => total + inv.stock, 0) || 0;
    };

    const stockTotal = getStockTotal();

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: `📦 ${producto.nombre}`,
                jóvenes: `📦 ${producto.nombre}`,
                adultos: `Detalles del Producto`,
            })}
        >
            <Head title={`Producto: ${producto.nombre}`} />

            <div className={`space-y-6 ${getModeClasses()}`}>
                {/* Header con botones de acciones */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className={`text-3xl font-bold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: `� Información de ${producto.nombre}`,
                                jóvenes: `Detalles de ${producto.nombre}`,
                                adultos: `Información del Producto`,
                            })}
                        </h1>
                        <p className={`mt-2 text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '¡Aquí están todos los detalles de tu producto!',
                                jóvenes: 'Información completa del producto',
                                adultos: 'Información detallada del producto',
                            })}
                        </p>
                    </div>

                    <div className="flex space-x-2">
                        <Link
                            href={`/productos/${producto.id}/edit`}
                            className={`flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 ${getModeClasses()}`}
                        >
                            <span>✏️</span>
                            <span>
                                {getTextByMode({
                                    niños: 'Editar',
                                    jóvenes: 'Editar',
                                    adultos: 'Editar',
                                })}
                            </span>
                        </Link>
                        <Link
                            href="/productos"
                            className={`flex items-center space-x-2 rounded-lg bg-gray-600 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-700 ${getModeClasses()}`}
                        >
                            <span>⬅️</span>
                            <span>
                                {getTextByMode({
                                    niños: 'Volver',
                                    jóvenes: 'Volver',
                                    adultos: 'Volver',
                                })}
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Información del producto */}
                <div className="overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
                    <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2">
                        {/* Imagen del producto */}
                        <div className="flex justify-center">
                            {producto.imagen ? (
                                <img src={producto.imagen} alt={producto.nombre} className="h-auto max-w-full rounded-lg shadow-md" />
                            ) : (
                                <div className="flex h-64 w-64 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700">
                                    <span className="text-6xl">{settings.ageMode === 'niños' ? '📦' : '🖼️'}</span>
                                </div>
                            )}
                        </div>

                        {/* Información básica */}
                        <div className="space-y-4">
                            <div>
                                <h2 className={`mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>{producto.nombre}</h2>
                                {producto.descripcion && (
                                    <p className={`text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>{producto.descripcion}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                                    <h3 className={`mb-2 font-semibold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '🏷️ Código',
                                            jóvenes: '🏷️ Código',
                                            adultos: 'Código',
                                        })}
                                    </h3>
                                    <p className={`text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>{producto.cod_producto}</p>
                                </div>

                                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                                    <h3 className={`mb-2 font-semibold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '📂 Categoría',
                                            jóvenes: '📂 Categoría',
                                            adultos: 'Categoría',
                                        })}
                                    </h3>
                                    <p className={`text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>{producto.categoria.nombre}</p>
                                </div>

                                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                                    <h3 className={`mb-2 font-semibold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '💰 Precio de Compra',
                                            jóvenes: '💰 Precio de Compra',
                                            adultos: 'Precio de Compra',
                                        })}
                                    </h3>
                                    <p className={`text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>{formatPrice(producto.precio_compra)}</p>
                                </div>

                                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                                    <h3 className={`mb-2 font-semibold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                        {getTextByMode({
                                            niños: '💲 Precio de Venta',
                                            jóvenes: '💲 Precio de Venta',
                                            adultos: 'Precio de Venta',
                                        })}
                                    </h3>
                                    <p className={`text-xl font-bold text-green-600 dark:text-green-400 ${getModeClasses()}`}>
                                        {formatPrice(producto.precio_venta)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stock por almacén */}
                {producto.inventarios && producto.inventarios.length > 0 && (
                    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                        <h3 className={`mb-4 text-xl font-bold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '📊 Stock en Almacenes',
                                jóvenes: '📊 Stock por Almacén',
                                adultos: 'Inventario por Almacén',
                            })}
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {producto.inventarios.map((inventario) => (
                                <div key={inventario.id} className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                                    <h4 className={`mb-2 font-semibold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                        {inventario.almacen.nombre}
                                    </h4>
                                    <p
                                        className={`text-2xl font-bold ${
                                            inventario.stock > 10
                                                ? 'text-green-600 dark:text-green-400'
                                                : inventario.stock > 5
                                                  ? 'text-yellow-600 dark:text-yellow-400'
                                                  : 'text-red-600 dark:text-red-400'
                                        } ${getModeClasses()}`}
                                    >
                                        {inventario.stock}{' '}
                                        {getTextByMode({
                                            niños: 'unidades',
                                            jóvenes: 'unidades',
                                            adultos: 'und.',
                                        })}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                            <p className={`text-lg font-semibold text-blue-800 dark:text-blue-300 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: `🎯 Stock Total: ${stockTotal} unidades`,
                                    jóvenes: `📊 Stock Total: ${stockTotal} unidades`,
                                    adultos: `Stock Total: ${stockTotal} unidades`,
                                })}
                            </p>
                        </div>
                    </div>
                )}

                {/* Promociones */}
                {producto.promociones && producto.promociones.length > 0 && (
                    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                        <h3 className={`mb-4 text-xl font-bold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '🎉 Promociones',
                                jóvenes: '🎉 Promociones Activas',
                                adultos: 'Promociones Activas',
                            })}
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {producto.promociones.map((promocion) => (
                                <div
                                    key={promocion.id}
                                    className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20"
                                >
                                    <h4 className={`mb-2 font-semibold text-green-800 dark:text-green-300 ${getModeClasses()}`}>
                                        {promocion.nombre}
                                    </h4>
                                    <p className={`text-lg font-bold text-green-600 dark:text-green-400 ${getModeClasses()}`}>
                                        {promocion.descuento}%{' '}
                                        {getTextByMode({
                                            niños: 'de descuento',
                                            jóvenes: 'descuento',
                                            adultos: 'descuento',
                                        })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Información de fechas */}
                <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                    <h3 className={`mb-4 text-xl font-bold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: '📅 Información de Fechas',
                            jóvenes: '📅 Fechas',
                            adultos: 'Información de Registro',
                        })}
                    </h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                            <h4 className={`mb-2 font-semibold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '📝 Creado',
                                    jóvenes: '📝 Fecha de Creación',
                                    adultos: 'Fecha de Creación',
                                })}
                            </h4>
                            <p className={`text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                {new Date(producto.created_at).toLocaleDateString('es-CO', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                            <h4 className={`mb-2 font-semibold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                                {getTextByMode({
                                    niños: '📝 Última Actualización',
                                    jóvenes: '📝 Última Modificación',
                                    adultos: 'Última Modificación',
                                })}
                            </h4>
                            <p className={`text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                                {new Date(producto.updated_at).toLocaleDateString('es-CO', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
