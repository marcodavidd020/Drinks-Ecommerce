import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

interface Props {
    user: User;
}

export default function UsersEdit({ user }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Usuarios', href: '/users' },
        { title: user.name, href: `/users/${user.id}` },
        { title: 'Editar', href: `/users/${user.id}/edit` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar Usuario: ${user.name}`} />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Editar Usuario
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Modifica la información del usuario.
                    </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            Información del Usuario: {user.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Email: {user.email}
                        </p>
                    </div>
                    
                    <p className="text-gray-500 dark:text-gray-400">
                        Formulario de edición de usuarios en desarrollo...
                    </p>
                </div>
            </div>
        </AppLayout>
    );
} 