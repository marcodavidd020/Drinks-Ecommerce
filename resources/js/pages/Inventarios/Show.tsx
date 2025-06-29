import { InfoCard, ShowHeader } from '@/components/Show';
import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
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
    precio_compra: number;
    descripcion?: string;
    imagen?: string;
    categoria?: Categoria;
}

interface Almacen {
    id: number;
    nombre: string;
    ubicacion: string;
}

interface InventarioData {
    id: number;
    producto: Producto;
    almacen: Almacen;
    stock: number;
    created_at: string;
    updated_at: string;
}

interface InventarioShowProps {
    inventario: InventarioData;
}

export default function InventarioShow({ inventario }: InventarioShowProps) {
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Campos para la sección de información básica de inventario
    const inventarioInfoFields = [
        {
            label: getTextByMode({
                niños: '📊 Stock',
                jóvenes: 'Stock',
                adultos: 'Stock Actual',
            }),
            value: (
                <div className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-sm font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {inventario.stock} unidades
                </div>
            ),
        },
        {
            label: getTextByMode({
                niños: '📅 Creado',
                jóvenes: 'Fecha de creación',
                adultos: 'Fecha de creación',
            }),
            value: formatDate(inventario.created_at),
        },
        {
            label: getTextByMode({
                niños: '📅 Actualizado',
                jóvenes: 'Última actualización',
                adultos: 'Última actualización',
            }),
            value: formatDate(inventario.updated_at),
        },
    ];

    // Campos para la sección de información del producto
    const productoInfoFields = [
        {
            label: getTextByMode({
                niños: '📦 Producto',
                jóvenes: 'Nombre',
                adultos: 'Nombre del Producto',
            }),
            value: inventario.producto.nombre,
        },
        {
            label: getTextByMode({
                niños: '🔢 Código',
                jóvenes: 'Código',
                adultos: 'Código del Producto',
            }),
            value: inventario.producto.cod_producto,
        },
        {
            label: getTextByMode({
                niños: '📝 Descripción',
                jóvenes: 'Descripción',
                adultos: 'Descripción',
            }),
            value: inventario.producto.descripcion || 'Sin descripción',
            span: 2 as const,
        },
        {
            label: getTextByMode({
                niños: '🏷️ Categoría',
                jóvenes: 'Categoría',
                adultos: 'Categoría',
            }),
            value: inventario.producto.categoria ? inventario.producto.categoria.nombre : 'Sin categoría',
        },
        {
            label: getTextByMode({
                niños: '💰 Precio Compra',
                jóvenes: 'Precio de compra',
                adultos: 'Precio de compra',
            }),
            value: formatCurrency(inventario.producto.precio_compra),
        },
        {
            label: getTextByMode({
                niños: '💰 Precio Venta',
                jóvenes: 'Precio de venta',
                adultos: 'Precio de venta',
            }),
            value: formatCurrency(inventario.producto.precio_venta),
        },
    ];

    // Campos para la sección de información del almacén
    const almacenInfoFields = [
        {
            label: getTextByMode({
                niños: '🏬 Almacén',
                jóvenes: 'Nombre',
                adultos: 'Nombre del Almacén',
            }),
            value: inventario.almacen.nombre,
        },
        {
            label: getTextByMode({
                niños: '📍 Ubicación',
                jóvenes: 'Ubicación',
                adultos: 'Ubicación',
            }),
            value: inventario.almacen.ubicacion,
            span: 2 as const,
        },
    ];

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: `📦 Inventario: ${inventario.producto.nombre}`,
                jóvenes: `Inventario: ${inventario.producto.nombre}`,
                adultos: `Detalle de Inventario: ${inventario.producto.nombre}`,
            })}
        >
            <Head title={`Inventario: ${inventario.producto.nombre}`} />

            <div className={`space-y-6 ${getModeClasses()}`}>
                <ShowHeader
                    title={getTextByMode({
                        niños: `📦 ¡Inventario de ${inventario.producto.nombre}!`,
                        jóvenes: `Inventario: ${inventario.producto.nombre}`,
                        adultos: `Detalle de Inventario: ${inventario.producto.nombre}`,
                    })}
                    description={getTextByMode({
                        niños: `¡Aquí puedes ver todos los detalles del inventario en ${inventario.almacen.nombre}!`,
                        jóvenes: `Detalles del inventario en ${inventario.almacen.nombre}`,
                        adultos: `Información detallada del producto ${inventario.producto.nombre} en el almacén ${inventario.almacen.nombre}`,
                    })}
                    editHref={`/inventarios/${inventario.id}/edit`}
                    backHref="/inventarios"
                    canDelete={true}
                    deleteAction={`/inventarios/${inventario.id}`}
                    deleteWarning={getTextByMode({
                        niños: `¿Seguro que quieres eliminar este registro de inventario?`,
                        jóvenes: `¿Eliminar registro de inventario?`,
                        adultos: `¿Está seguro de que desea eliminar este registro de inventario?`,
                    })}
                />

                <InfoCard
                    title={getTextByMode({
                        niños: '📊 Información del Inventario',
                        jóvenes: 'Información de Stock',
                        adultos: 'Información de Inventario',
                    })}
                    fields={inventarioInfoFields}
                />

                <InfoCard
                    title={getTextByMode({
                        niños: '📦 Información del Producto',
                        jóvenes: 'Información del Producto',
                        adultos: 'Información del Producto',
                    })}
                    fields={productoInfoFields}
                    actions={
                        <Link
                            href={`/productos/${inventario.producto.id}`}
                            className="inline-flex items-center rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                        >
                            {getTextByMode({
                                niños: '👁️ Ver Producto',
                                jóvenes: 'Ver Producto',
                                adultos: 'Ver Producto',
                            })}
                        </Link>
                    }
                />

                <InfoCard
                    title={getTextByMode({
                        niños: '🏬 Información del Almacén',
                        jóvenes: 'Información del Almacén',
                        adultos: 'Información del Almacén',
                    })}
                    fields={almacenInfoFields}
                    actions={
                        <Link
                            href={`/almacenes/${inventario.almacen.id}`}
                            className="inline-flex items-center rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                        >
                            {getTextByMode({
                                niños: '👁️ Ver Almacén',
                                jóvenes: 'Ver Almacén',
                                adultos: 'Ver Almacén',
                            })}
                        </Link>
                    }
                />
            </div>
        </DashboardLayout>
    );
} 