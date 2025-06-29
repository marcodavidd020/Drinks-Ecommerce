import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head } from '@inertiajs/react';
import { ShowHeader, InfoCard } from '@/components/Show';

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

    // Configuración de campos para InfoCard
    const infoBasicaFields = [
        {
            label: getTextByMode({
                niños: '📦 Producto',
                jóvenes: '📦 Producto',
                adultos: 'Nombre del Producto',
            }),
            value: (
                <div className="flex items-center space-x-3">
                    <span className="font-medium">{producto.nombre}</span>
                </div>
            ),
            span: 2 as const
        },
        {
            label: getTextByMode({
                niños: '🏷️ Código',
                jóvenes: '🏷️ Código',
                adultos: 'Código de Producto',
            }),
            value: producto.cod_producto
        },
        {
            label: getTextByMode({
                niños: '📂 Categoría',
                jóvenes: '📂 Categoría',
                adultos: 'Categoría',
            }),
            value: producto.categoria.nombre
        }
    ];

    // Si tiene descripción, agregarla
    if (producto.descripcion) {
        infoBasicaFields.push({
            label: getTextByMode({
                niños: '📝 Descripción',
                jóvenes: '📝 Descripción',
                adultos: 'Descripción',
            }),
            value: <span>{producto.descripcion}</span>,
            span: 2 as const
        });
    }

    const precioPrecioFields = [
        {
            label: getTextByMode({
                niños: '💰 Precio de Compra',
                jóvenes: '💰 Precio de Compra',
                adultos: 'Precio de Compra',
            }),
            value: formatPrice(producto.precio_compra)
        },
        {
            label: getTextByMode({
                niños: '💲 Precio de Venta',
                jóvenes: '💲 Precio de Venta',
                adultos: 'Precio de Venta',
            }),
            value: (
                <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    {formatPrice(producto.precio_venta)}
                </span>
            )
        }
    ];

    const stockTotalFields = [
        {
            label: getTextByMode({
                niños: '🎯 Stock Total',
                jóvenes: '📊 Stock Total',
                adultos: 'Stock Total',
            }),
            value: (
                <span className={`text-xl font-bold ${
                    stockTotal > 10
                        ? 'text-green-600 dark:text-green-400'
                        : stockTotal > 5
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-red-600 dark:text-red-400'
                }`}>
                    {stockTotal} {getTextByMode({
                        niños: 'unidades',
                        jóvenes: 'unidades',
                        adultos: 'und.',
                    })}
                </span>
            ),
            span: 2 as const
        }
    ];

    const fechasFields = [
        {
            label: getTextByMode({
                niños: '📅 Fecha de Creación',
                jóvenes: '📅 Creado el',
                adultos: 'Fecha de Creación',
            }),
            value: new Date(producto.created_at).toLocaleDateString('es-CO')
        },
        {
            label: getTextByMode({
                niños: '🔄 Última Actualización',
                jóvenes: '🔄 Actualizado el',
                adultos: 'Última Actualización',
            }),
            value: new Date(producto.updated_at).toLocaleDateString('es-CO')
        }
    ];

    // Campos para inventarios por almacén
    const inventariosAlmacenFields = producto.inventarios?.map(inventario => ({
        label: inventario.almacen.nombre,
        value: (
            <span className={`text-lg font-bold ${
                inventario.stock > 10
                    ? 'text-green-600 dark:text-green-400'
                    : inventario.stock > 5
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
            }`}>
                {inventario.stock} {getTextByMode({
                    niños: 'unidades',
                    jóvenes: 'unidades',
                    adultos: 'und.',
                })}
            </span>
        )
    })) || [];

    // Campos para promociones
    const promocionesFields = producto.promociones?.map(promocion => ({
        label: promocion.nombre,
        value: (
            <span className="text-lg font-bold text-red-600 dark:text-red-400">
                {promocion.descuento}% {getTextByMode({
                    niños: 'de descuento',
                    jóvenes: 'de descuento',
                    adultos: 'descuento',
                })}
            </span>
        )
    })) || [];

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
                <ShowHeader
                    title={getTextByMode({
                        niños: `📦 Información de ${producto.nombre}`,
                        jóvenes: `Detalles de ${producto.nombre}`,
                        adultos: `Información del Producto`,
                    })}
                    description={getTextByMode({
                        niños: '¡Aquí están todos los detalles de tu producto!',
                        jóvenes: 'Información completa del producto',
                        adultos: 'Información detallada del producto',
                    })}
                    editHref={`/productos/${producto.id}/edit`}
                    backHref="/productos"
                    editText={getTextByMode({
                        niños: '✏️ Editar',
                        jóvenes: 'Editar',
                        adultos: 'Editar',
                    })}
                    backText={getTextByMode({
                        niños: '⬅️ Volver',
                        jóvenes: 'Volver',
                        adultos: 'Volver',
                    })}
                />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Imagen del producto */}
                    <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                        <h3 className={`mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                            {getTextByMode({
                                niños: '🖼️ Imagen del Producto',
                                jóvenes: '🖼️ Imagen',
                                adultos: 'Imagen del Producto',
                            })}
                        </h3>
                        <div className="flex justify-center">
                            {producto.imagen ? (
                                <img src={producto.imagen} alt={producto.nombre} className="h-auto max-w-full rounded-lg shadow-md" />
                            ) : (
                                <div className="flex h-64 w-64 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700">
                                    <span className="text-6xl">{settings.ageMode === 'niños' ? '📦' : '🖼️'}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Información básica */}
                    <div className="space-y-6">
                        <InfoCard
                            title={getTextByMode({
                                niños: '📋 Información Básica',
                                jóvenes: '📋 Información Básica',
                                adultos: 'Información Básica',
                            })}
                            fields={infoBasicaFields}
                            columns={2}
                        />

                        <InfoCard
                            title={getTextByMode({
                                niños: '💰 Precios',
                                jóvenes: '💰 Precios',
                                adultos: 'Información de Precios',
                            })}
                            fields={precioPrecioFields}
                            columns={2}
                        />

                        <InfoCard
                            title={getTextByMode({
                                niños: '📦 Stock Total',
                                jóvenes: '📦 Stock Total',
                                adultos: 'Stock Total',
                            })}
                            fields={stockTotalFields}
                            columns={1}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Inventarios por almacén */}
                    {inventariosAlmacenFields.length > 0 && (
                        <InfoCard
                            title={getTextByMode({
                                niños: '📊 Stock en Almacenes',
                                jóvenes: '📊 Stock por Almacén',
                                adultos: 'Inventario por Almacén',
                            })}
                            fields={inventariosAlmacenFields}
                            columns={2}
                        />
                    )}

                    {/* Promociones */}
                    {promocionesFields.length > 0 && (
                        <InfoCard
                            title={getTextByMode({
                                niños: '🎉 Promociones',
                                jóvenes: '🎉 Promociones Activas',
                                adultos: 'Promociones Activas',
                            })}
                            fields={promocionesFields}
                            columns={1}
                        />
                    )}

                    {/* Fechas */}
                    <InfoCard
                        title={getTextByMode({
                            niños: '📅 Fechas',
                            jóvenes: '📅 Fechas',
                            adultos: 'Información de Fechas',
                        })}
                        fields={fechasFields}
                        columns={2}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
