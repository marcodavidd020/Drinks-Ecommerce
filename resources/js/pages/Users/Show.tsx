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

export default function UsersShow({ user }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Usuarios', href: '/users' },
        { title: user.name, href: `/users/${user.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Usuario: ${user.name}`} />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Detalles del Usuario
                    </h1>
                </div>
                
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nombre
                            </label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                {user.name}
                            </p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email
                            </label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                {user.email}
                            </p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Fecha de Registro
                            </label>
                            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                                {new Date(user.created_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 