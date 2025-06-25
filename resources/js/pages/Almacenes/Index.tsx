import { BaseIndex } from '@/components/DataTable';

interface Almacen {
    id: number;
    nombre: string;
    ubicacion: string;
    descripcion?: string;
    productos_count: number; // Cambiado para coincidir con el backend
    created_at: string;
    updated_at: string;
}

interface AlmacenesIndexProps {
    almacenes: {
        data: Almacen[];
        links: Record<string, unknown>[];
        meta?: Record<string, unknown>;
    };
    filters: {
        search: string;
        sort_by: string;
        sort_order: string;
        per_page: number;
    };
}

export default function AlmacenesIndex({ almacenes, filters }: AlmacenesIndexProps) {
    const columns = [
        {
            key: 'nombre',
            label: {
                niños: '🏬 Nombre',
                jóvenes: 'Nombre',
                adultos: 'Nombre',
            },
            sortable: true,
        },
        {
            key: 'ubicacion',
            label: {
                niños: '📍 Ubicación',
                jóvenes: 'Ubicación',
                adultos: 'Ubicación',
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
            render: (count: number) => (
                <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    {count || 0} productos
                </span>
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
            href: (almacen: Almacen) => `/almacenes/${almacen.id}`,
            variant: 'secondary' as const,
        },
        {
            label: {
                niños: '✏️ Editar',
                jóvenes: 'Editar',
                adultos: 'Editar',
            },
            icon: '✏️',
            href: (almacen: Almacen) => `/almacenes/${almacen.id}/edit`,
            variant: 'primary' as const,
        },
    ];

    return (
        <BaseIndex
            data={almacenes}
            filters={filters}
            entityName="almacén"
            routeName="almacenes"
            title={{
                niños: '🏬 ¡Mis Almacenes!',
                jóvenes: '🏬 Almacenes',
                adultos: 'Gestión de Almacenes',
            }}
            description={{
                niños: '¡Aquí puedes ver todos los lugares donde guardas cosas!',
                jóvenes: 'Administra los almacenes y depósitos',
                adultos: 'Administre los almacenes y depósitos del sistema',
            }}
            columns={columns}
            actions={actions}
        />
    );
} 