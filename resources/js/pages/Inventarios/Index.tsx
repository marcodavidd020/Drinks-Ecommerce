import { BaseIndex } from '@/components/DataTable';

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
        links: Record<string, unknown>[];
        meta?: Record<string, unknown>;
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
    const columns = [
        {
            key: 'producto',
            label: {
                niños: '📦 Producto',
                jóvenes: 'Producto',
                adultos: 'Producto',
            },
            render: (producto: Producto) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{producto.nombre}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Código: {producto.cod_producto}</div>
                    {producto.categoria && <div className="text-xs text-gray-400 dark:text-gray-500">{producto.categoria.nombre}</div>}
                </div>
            ),
            sortable: true,
        },
        {
            key: 'almacen',
            label: {
                niños: '🏬 Almacén',
                jóvenes: 'Almacén',
                adultos: 'Almacén',
            },
            render: (almacen: Almacen) => (
                <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {almacen.nombre}
                </span>
            ),
            sortable: true,
        },
        {
            key: 'stock',
            label: {
                niños: '📊 Cantidad',
                jóvenes: 'Stock',
                adultos: 'Stock Disponible',
            },
            render: (stock: number) => (
                <div
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        stock > 50
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : stock > 10
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                >
                    {stock} unidades
                </div>
            ),
            sortable: true,
        },
        {
            key: 'created_at',
            label: {
                niños: '📅 Creado',
                jóvenes: 'Fecha Creación',
                adultos: 'Fecha de Creación',
            },
            render: (fecha: string) => new Date(fecha).toLocaleDateString(),
            sortable: true,
        },
    ];

    const actions = [
        {
            label: {
                niños: '👀 Ver',
                jóvenes: 'Ver',
                adultos: 'Ver',
            },
            icon: '👀',
            href: (inventario: ProductoInventario) => `/inventarios/${inventario.id}`,
            variant: 'secondary' as const,
        },
        {
            label: {
                niños: '✏️ Editar',
                jóvenes: 'Editar',
                adultos: 'Editar',
            },
            icon: '✏️',
            href: (inventario: ProductoInventario) => `/inventarios/${inventario.id}/edit`,
            variant: 'primary' as const,
        },
    ];

    // Filtros personalizados para almacén y categoría
    const customFilters = [
        {
            type: 'select' as const,
            value: filters.almacen,
            onChange: () => {
                // Esta lógica se manejará en BaseIndex
            },
            options: [
                {
                    value: '',
                    label: {
                        niños: '🏬 Todos los almacenes',
                        jóvenes: 'Todos los almacenes',
                        adultos: 'Todos los almacenes',
                    },
                },
                ...almacenes.map((almacen) => ({
                    value: almacen.id.toString(),
                    label: {
                        niños: `🏬 ${almacen.nombre}`,
                        jóvenes: almacen.nombre,
                        adultos: almacen.nombre,
                    },
                })),
            ],
        },
        {
            type: 'select' as const,
            value: filters.categoria,
            onChange: () => {
                // Esta lógica se manejará en BaseIndex
            },
            options: [
                {
                    value: '',
                    label: {
                        niños: '📁 Todas las categorías',
                        jóvenes: 'Todas las categorías',
                        adultos: 'Todas las categorías',
                    },
                },
                ...categorias.map((categoria) => ({
                    value: categoria.id.toString(),
                    label: {
                        niños: `📁 ${categoria.nombre}`,
                        jóvenes: categoria.nombre,
                        adultos: categoria.nombre,
                    },
                })),
            ],
        },
    ];

    return (
        <BaseIndex
            data={inventarios}
            filters={filters}
            entityName="inventario"
            routeName="inventarios"
            title={{
                niños: '📦 ¡Mi Inventario!',
                jóvenes: '📦 Inventario',
                adultos: 'Gestión de Inventario',
            }}
            description={{
                niños: '¡Aquí puedes ver todos los productos en los almacenes!',
                jóvenes: 'Gestión de productos en almacenes',
                adultos: 'Administración de productos en inventario por almacén',
            }}
            columns={columns}
            actions={actions}
            customFilters={customFilters}
        />
    );
}
