import { BaseIndex } from '@/components/DataTable';

interface Categoria {
    id: number;
    nombre: string;
    descripcion?: string;
    productos_count: number;
    created_at: string;
    updated_at: string;
}

interface CategoriasIndexProps {
    categorias: {
        data: Categoria[];
        links: any[];
        meta?: any;
    };
    filters: {
        search: string;
        sort_by: string;
        sort_order: string;
        per_page: number;
    };
}

export default function CategoriasIndex({ categorias, filters }: CategoriasIndexProps) {
    const columns = [
        {
            key: 'nombre',
            label: {
                niños: '🏷️ Nombre',
                jóvenes: 'Nombre',
                adultos: 'Nombre',
            },
            sortable: true,
        },
        {
            key: 'descripcion',
            label: {
                niños: '📝 Descripción',
                jóvenes: 'Descripción',
                adultos: 'Descripción',
            },
            render: (value: string) => value || 'Sin descripción',
            sortable: true,
        },
        {
            key: 'productos_count',
            label: {
                niños: '📦 Productos',
                jóvenes: 'N° Productos',
                adultos: 'Número de Productos',
            },
            type: 'number' as const,
            sortable: true,
        },
        {
            key: 'created_at',
            label: {
                niños: '📅 Creado',
                jóvenes: 'Fecha Creación',
                adultos: 'Fecha de Creación',
            },
            type: 'date' as const,
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
            href: (categoria: Categoria) => `/categorias/${categoria.id}`,
            variant: 'secondary' as const,
        },
        {
            label: {
                niños: '✏️ Editar',
                jóvenes: 'Editar',
                adultos: 'Editar',
            },
            icon: '✏️',
            href: (categoria: Categoria) => `/categorias/${categoria.id}/edit`,
            variant: 'primary' as const,
        },
    ];

    return (
        <BaseIndex
            data={categorias}
            filters={filters}
            entityName="categoría"
            routeName="categorias"
            title={{
                niños: '🏷️ ¡Mis Categorías!',
                jóvenes: '🏷️ Categorías',
                adultos: 'Gestión de Categorías',
            }}
            description={{
                niños: '¡Aquí puedes ver todas las categorías súper geniales!',
                jóvenes: 'Administra las categorías de productos',
                adultos: 'Administre las categorías de productos del sistema',
            }}
            columns={columns}
            actions={actions}
        />
    );
}
