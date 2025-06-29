import { BaseIndex } from '@/components/DataTable';
import { formatCurrency } from '@/lib/currency';

interface Categoria {
    id: number;
    nombre: string;
}

interface Producto {
    id: number;
    cod_producto: string;
    nombre: string;
    precio_compra: number | string;
    precio_venta: number | string;
    imagen?: string;
    descripcion?: string;
    categoria: Categoria;
    stock_total?: number;
    created_at: string;
    updated_at: string;
}

interface ProductosIndexProps {
    productos: {
        data: Producto[];
        links: Array<{ url?: string; label: string; active: boolean }>;
        meta?: Record<string, unknown>;
        total: number;
        from: number;
        to: number;
        per_page: number;
        current_page: number;
        last_page: number;
    };
    categorias: Categoria[];
    filters: {
        search: string;
        categoria: string;
        sort_by: string;
        sort_order: string;
        per_page: number;
        page?: number;
    };
}

export default function ProductosIndex({ productos, categorias, filters }: ProductosIndexProps) {
    const columns = [
        {
            key: 'imagen',
            label: {
                niños: '🖼️ Foto',
                jóvenes: 'Imagen',
                adultos: 'Imagen',
            },
            render: (imagen: string, producto: Producto) => (
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                    {imagen ? (
                        <img
                            src={imagen}
                            alt={producto.nombre}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <span className="text-xl">📦</span>
                    )}
                </div>
            ),
            sortable: false,
        },
        {
            key: 'cod_producto',
            label: {
                niños: '🏷️ Código',
                jóvenes: 'Código',
                adultos: 'Código',
            },
            sortable: true,
        },
        {
            key: 'nombre',
            label: {
                niños: '📝 Nombre',
                jóvenes: 'Nombre',
                adultos: 'Nombre',
            },
            render: (nombre: string, producto: Producto) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{nombre}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{producto.categoria.nombre}</div>
                </div>
            ),
            sortable: true,
        },
        {
            key: 'precio_venta',
            label: {
                niños: '💰 Precio',
                jóvenes: 'Precio Venta',
                adultos: 'Precio de Venta',
            },
            render: (precio: number | string) => (
                <span className="font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(precio)}
                </span>
            ),
            sortable: true,
        },
        {
            key: 'stock_total',
            label: {
                niños: '📦 Stock',
                jóvenes: 'Stock',
                adultos: 'Stock Total',
            },
            render: (stock: number) => (
                <div
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        stock > 10
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : stock > 0
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                >
                    {stock || 0}
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
            render: (value: string) => new Date(value).toLocaleDateString(),
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
            href: (producto: Producto) => `/productos/${producto.id}`,
            variant: 'secondary' as const,
        },
        {
            label: {
                niños: '✏️ Editar',
                jóvenes: 'Editar',
                adultos: 'Editar',
            },
            icon: '✏️',
            href: (producto: Producto) => `/productos/${producto.id}/edit`,
            variant: 'primary' as const,
        },
    ];

    // Filtros personalizados para categorías
    const customFilters = [
        {
            type: 'select' as const,
            key: 'categoria',
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
                ...categorias.map(categoria => ({
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
            data={productos}
            filters={filters}
            entityName="producto"
            routeName="productos"
            title={{
                niños: '🛒 ¡Mis Productos!',
                jóvenes: '📦 Productos',
                adultos: 'Gestión de Productos',
            }}
            description={{
                niños: '¡Aquí puedes ver todos los productos increíbles!',
                jóvenes: 'Administra tu inventario de productos',
                adultos: 'Administre el catálogo de productos del sistema',
            }}
            columns={columns}
            actions={actions}
            customFilters={customFilters}
        />
    );
} 
