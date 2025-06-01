import { DataTable, PageHeader, SearchFilters as FilterBar } from '@/components/DataTable';
import { useAppMode } from '@/contexts/AppModeContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Head, Link, router } from '@inertiajs/react';
import { AdjustmentsHorizontalIcon, PlusIcon, ArrowPathIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface Categoria {
    id: number;
    nombre: string;
}

interface Almacen {
    id: number;
    nombre: string;
}

interface Producto {
    id: number;
    nombre: string;
    cod_producto: string;
    precio_venta: number;
    categoria?: Categoria;
}

interface ProductoInventario {
    id: number;
    producto: Producto;
    almacen: Almacen;
    stock: number;
    created_at: string;
    updated_at: string;
}

interface InventariosIndexProps {
    inventarios: {
        data: ProductoInventario[];
        links: any;
        total: number;
        from: number;
        to: number;
        per_page: number;
        current_page: number;
        last_page: number;
    };
    almacenes: Almacen[];
    categorias: Categoria[];
    filters: {
        search: string;
        almacen: string;
        categoria: string;
        sort_by: string;
        sort_order: string;
        per_page: number;
    };
}

export default function InventariosIndex({ inventarios, almacenes, categorias, filters }: InventariosIndexProps) {
    const { settings } = useAppMode();
    const [showFilters, setShowFilters] = useState(false);

    const getTextByMode = (textos: { niños: string; jóvenes: string; adultos: string }) => {
        return textos[settings.ageMode as keyof typeof textos] || textos.adultos;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Columnas para la tabla
    const columns = [
        {
            label: getTextByMode({
                niños: '📦 Producto',
                jóvenes: 'Producto',
                adultos: 'Producto',
            }),
            field: 'producto.nombre',
            sortable: true,
            className: 'w-1/4',
            render: (item: ProductoInventario) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{item.producto.nombre}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {item.producto.cod_producto}
                        {item.producto.categoria && <span> | {item.producto.categoria.nombre}</span>}
                    </div>
                </div>
            ),
        },
        {
            label: getTextByMode({
                niños: '🏬 Almacén',
                jóvenes: 'Almacén',
                adultos: 'Almacén',
            }),
            field: 'almacen.nombre',
            sortable: true,
            className: 'w-1/5',
            render: (item: ProductoInventario) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{item.almacen.nombre}</div>
                </div>
            ),
        },
        {
            label: getTextByMode({
                niños: '📊 Stock',
                jóvenes: 'Stock',
                adultos: 'Stock',
            }),
            field: 'stock',
            sortable: true,
            className: 'w-1/6 text-center',
            render: (item: ProductoInventario) => (
                <div className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {item.stock} unidades
                </div>
            ),
        },
        {
            label: getTextByMode({
                niños: '📅 Fecha',
                jóvenes: 'Actualización',
                adultos: 'Última Actualización',
            }),
            field: 'updated_at',
            sortable: true,
            className: 'w-1/6',
            render: (item: ProductoInventario) => <div>{formatDate(item.updated_at)}</div>,
        },
        {
            label: getTextByMode({
                niños: '🔧 Acciones',
                jóvenes: 'Acciones',
                adultos: 'Acciones',
            }),
            field: 'actions',
            className: 'w-1/6 text-right',
            render: (item: ProductoInventario) => (
                <div className="flex justify-end space-x-2">
                    <Link
                        href={`/inventarios/${item.id}`}
                        className="rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                    >
                        {getTextByMode({
                            niños: '👁️ Ver',
                            jóvenes: 'Ver',
                            adultos: 'Ver',
                        })}
                    </Link>
                    <Link
                        href={`/inventarios/${item.id}/edit`}
                        className="rounded bg-amber-50 px-2 py-1 text-xs font-medium text-amber-600 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/30"
                    >
                        {getTextByMode({
                            niños: '✏️ Editar',
                            jóvenes: 'Editar',
                            adultos: 'Editar',
                        })}
                    </Link>
                </div>
            ),
        },
    ];

    // Opciones para filtros
    const perPageOptions = [
        { value: '10', label: '10' },
        { value: '25', label: '25' },
        { value: '50', label: '50' },
        { value: '100', label: '100' },
    ];

    const almacenOptions = [
        { value: '', label: 'Todos los almacenes' },
        ...almacenes.map((a) => ({ value: a.id.toString(), label: a.nombre })),
    ];

    const categoriaOptions = [
        { value: '', label: 'Todas las categorías' },
        ...categorias.map((c) => ({ value: c.id.toString(), label: c.nombre })),
    ];

    // Manejadores de filtros
    const handleSearch = (value: string) => {
        router.get(
            '/inventarios',
            { ...filters, search: value, page: 1 },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handlePerPageChange = (value: string) => {
        router.get(
            '/inventarios',
            { ...filters, per_page: value, page: 1 },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleAlmacenChange = (value: string) => {
        router.get(
            '/inventarios',
            { ...filters, almacen: value, page: 1 },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleCategoriaChange = (value: string) => {
        router.get(
            '/inventarios',
            { ...filters, categoria: value, page: 1 },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleSort = (field: string) => {
        const sortOrder = filters.sort_by === field && filters.sort_order === 'asc' ? 'desc' : 'asc';
        router.get(
            '/inventarios',
            { ...filters, sort_by: field, sort_order: sortOrder },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/inventarios',
            { ...filters, page },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const clearFilters = () => {
        router.get(
            '/inventarios',
            {
                search: '',
                almacen: '',
                categoria: '',
                sort_by: 'created_at',
                sort_order: 'desc',
                per_page: 10,
                page: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <DashboardLayout
            title={getTextByMode({
                niños: '📦 Inventario de Productos',
                jóvenes: 'Inventario',
                adultos: 'Gestión de Inventario',
            })}
        >
            <Head title="Inventario de Productos" />

            <div className="space-y-4">
                <PageHeader
                    title={getTextByMode({
                        niños: '📦 ¡Inventario de Productos!',
                        jóvenes: 'Inventario de Productos',
                        adultos: 'Gestión de Inventario',
                    })}
                    description={getTextByMode({
                        niños: '¡Aquí puedes ver todos los productos en stock!',
                        jóvenes: 'Gestión de productos en almacenes',
                        adultos: 'Administración de productos en inventario por almacén',
                    })}
                    actions={
                        <>
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                            >
                                <AdjustmentsHorizontalIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                                Filtros
                            </button>
                            <Link
                                href="/inventarios/create"
                                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
                            >
                                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                Nuevo Registro
                            </Link>
                        </>
                    }
                />

                {showFilters && (
                    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div>
                                <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Buscar
                                </label>
                                <input
                                    type="text"
                                    id="search"
                                    value={filters.search}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                                    placeholder="Buscar por nombre, código..."
                                />
                            </div>
                            <div>
                                <label htmlFor="per_page" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Por página
                                </label>
                                <select
                                    id="per_page"
                                    value={filters.per_page.toString()}
                                    onChange={(e) => handlePerPageChange(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                                >
                                    {perPageOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="almacen" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Almacén
                                </label>
                                <select
                                    id="almacen"
                                    name="almacen"
                                    value={filters.almacen}
                                    onChange={(e) => handleAlmacenChange(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 sm:text-sm"
                                >
                                    {almacenOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Categoría
                                </label>
                                <select
                                    id="categoria"
                                    name="categoria"
                                    value={filters.categoria}
                                    onChange={(e) => handleCategoriaChange(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 sm:text-sm"
                                >
                                    {categoriaOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="mt-5 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                >
                                    Limpiar filtros
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    {columns.map((column) => (
                                        <th
                                            key={column.field}
                                            className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 ${column.className || ''}`}
                                            onClick={() => column.sortable && handleSort(column.field)}
                                            style={{ cursor: column.sortable ? 'pointer' : 'default' }}
                                        >
                                            {column.label}
                                            {column.sortable && filters.sort_by === column.field && (
                                                <span className="ml-1">
                                                    {filters.sort_order === 'asc' ? '↑' : '↓'}
                                                </span>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                {inventarios.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                            <div className="py-6">
                                                <p className="text-lg font-semibold">No hay registros de inventario</p>
                                                <p className="mt-1">No se encontraron registros de inventario con los filtros aplicados.</p>
                                                <Link
                                                    href="/inventarios/create"
                                                    className="mt-3 inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                                                >
                                                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                                    Agregar nuevo registro
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    inventarios.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            {columns.map((column) => (
                                                <td key={column.field} className={`px-6 py-4 whitespace-nowrap ${column.className || ''}`}>
                                                    {column.render ? column.render(item) : item[column.field] || '-'}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Paginación */}
                    {inventarios.data.length > 0 && (
                        <div className="border-t border-gray-200 px-4 py-3 dark:border-gray-700 sm:px-6">
                            <div className="flex flex-wrap items-center justify-between">
                                <div className="flex w-full flex-1 justify-between sm:hidden">
                                    <button
                                        onClick={() => handlePageChange(inventarios.current_page - 1)}
                                        disabled={inventarios.current_page === 1}
                                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(inventarios.current_page + 1)}
                                        disabled={inventarios.current_page === inventarios.last_page}
                                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            Mostrando <span className="font-medium">{inventarios.from}</span> a{' '}
                                            <span className="font-medium">{inventarios.to}</span> de{' '}
                                            <span className="font-medium">{inventarios.total}</span> resultados
                                        </p>
                                    </div>
                                    <div>
                                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                            <button
                                                onClick={() => handlePageChange(inventarios.current_page - 1)}
                                                disabled={inventarios.current_page === 1}
                                                className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                                            >
                                                <span className="sr-only">Anterior</span>
                                                &larr;
                                            </button>
                                            {Array.from({ length: inventarios.last_page }, (_, i) => i + 1).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
                                                        page === inventarios.current_page
                                                            ? 'z-10 border-blue-500 bg-blue-50 text-blue-600 dark:border-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                                            : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => handlePageChange(inventarios.current_page + 1)}
                                                disabled={inventarios.current_page === inventarios.last_page}
                                                className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
                                            >
                                                <span className="sr-only">Siguiente</span>
                                                &rarr;
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
} 