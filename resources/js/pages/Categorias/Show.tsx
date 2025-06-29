import { InfoCard, ShowHeader } from '@/components/Show';
import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, Link } from '@inertiajs/react';
import { formatCurrency } from '@/lib/currency';

interface Producto {
    id: number;
    nombre: string;
    cod_producto: string;
    precio_venta: number;
    imagen?: string;
}

interface Categoria {
    id: number;
    nombre: string;
    descripcion?: string;
    productos: Producto[];
    productos_count: number;
    created_at: string;
    updated_at: string;
}

interface CategoriaShowProps {
    categoria: Categoria;
}

export default function CategoriaShow({ categoria }: CategoriaShowProps) {
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

    // Campos para la sección de información básica
    const basicInfoFields = [
        {
            label: getTextByMode({
                niños: '📝 Nombre',
                jóvenes: 'Nombre',
                adultos: 'Nombre',
            }),
            value: categoria.nombre,
        },
        {
            label: getTextByMode({
                niños: '📝 Descripción',
                jóvenes: 'Descripción',
                adultos: 'Descripción',
            }),
            value:
                categoria.descripcion ||
                getTextByMode({
                    niños: '¡No hay descripción!',
                    jóvenes: 'Sin descripción',
                    adultos: 'No hay descripción disponible',
                }),
            span: 2 as const,
        },
        {
            label: getTextByMode({
                niños: '📦 Productos',
                jóvenes: 'Productos',
                adultos: 'Cantidad de Productos',
            }),
            value: (
                <div
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        categoria.productos_count > 0
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                >
                    {categoria.productos_count}{' '}
                    {getTextByMode({
                        niños: categoria.productos_count === 1 ? 'producto' : 'productos',
                        jóvenes: 'prod.',
                        adultos: 'productos',
                    })}
                </div>
            ),
        },
        {
            label: getTextByMode({
                niños: '📅 Creada',
                jóvenes: 'Fecha de creación',
                adultos: 'Fecha de creación',
            }),
            value: formatDate(categoria.created_at),
        },
    ];

    // Renderizar productos de la categoría
    const renderProductos = () => {
        if (categoria.productos.length === 0) {
            return (
                <div className="py-4 text-center text-gray-500 dark:text-gray-400">
                    {getTextByMode({
                        niños: '😔 ¡No hay productos en esta categoría todavía!',
                        jóvenes: 'No hay productos en esta categoría',
                        adultos: 'No hay productos asociados a esta categoría',
                    })}
                </div>
            );
        }

        return (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {categoria.productos.map((producto) => (
                    <Link
                        key={producto.id}
                        href={`/productos/${producto.id}`}
                        className="flex flex-col overflow-hidden rounded-lg border border-gray-200 transition-all hover:shadow-md dark:border-gray-700"
                    >
                        <div className="h-32 bg-gray-100 dark:bg-gray-800">
                            {producto.imagen ? (
                                <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-cover" />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                                    <span className="text-2xl text-gray-400">📦</span>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-1 flex-col p-4">
                            <h3 className="mb-1 text-sm font-medium text-gray-900 dark:text-gray-100">{producto.nombre}</h3>
                            <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">{producto.cod_producto}</p>
                            <div className="mt-auto text-right text-sm font-bold text-green-600 dark:text-green-400">
                                {formatCurrency(producto.precio_venta)}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        );
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: `📁 Categoría: ${categoria.nombre}`,
                jóvenes: `Categoría: ${categoria.nombre}`,
                adultos: `Categoría: ${categoria.nombre}`,
            })}
        >
            <Head title={`Categoría: ${categoria.nombre}`} />

            <div className={`space-y-6 ${getModeClasses()}`}>
                <ShowHeader
                    title={getTextByMode({
                        niños: `📁 ¡Categoría ${categoria.nombre}!`,
                        jóvenes: `Categoría: ${categoria.nombre}`,
                        adultos: `Categoría: ${categoria.nombre}`,
                    })}
                    description={getTextByMode({
                        niños: '¡Aquí puedes ver todos los detalles de esta categoría!',
                        jóvenes: 'Detalles de la categoría',
                        adultos: 'Información detallada de la categoría',
                    })}
                    editHref={`/categorias/${categoria.id}/edit`}
                    backHref="/categorias"
                    canDelete={categoria.productos_count === 0}
                    deleteAction={`/categorias/${categoria.id}`}
                    deleteWarning={getTextByMode({
                        niños: `¿Seguro que quieres eliminar la categoría "${categoria.nombre}"?`,
                        jóvenes: `¿Eliminar categoría "${categoria.nombre}"?`,
                        adultos: `¿Está seguro de que desea eliminar la categoría "${categoria.nombre}"?`,
                    })}
                />

                <InfoCard
                    title={getTextByMode({
                        niños: '📋 Información Básica',
                        jóvenes: 'Información Básica',
                        adultos: 'Información Básica',
                    })}
                    fields={basicInfoFields}
                />

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <h2 className={`mb-4 text-xl font-bold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                        {getTextByMode({
                            niños: '📦 Productos en esta Categoría',
                            jóvenes: 'Productos en esta Categoría',
                            adultos: 'Productos Asociados',
                        })}
                    </h2>

                    {renderProductos()}

                    {categoria.productos_count > categoria.productos.length && (
                        <div className="mt-4 text-center">
                            <Link
                                href={`/productos?categoria=${categoria.id}`}
                                className="inline-flex items-center rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800"
                            >
                                {getTextByMode({
                                    niños: '🔍 ¡Ver todos los productos!',
                                    jóvenes: 'Ver todos los productos',
                                    adultos: 'Ver todos los productos',
                                })}
                                <svg
                                    className="ml-2 h-4 w-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
