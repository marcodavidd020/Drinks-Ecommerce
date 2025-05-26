import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Usuarios', href: '/users' },
    { title: 'Crear Usuario', href: '/users/create' },
];

export default function UsersCreate() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Usuario" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Crear Nuevo Usuario
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Agrega un nuevo usuario al sistema.
                    </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <p className="text-gray-500 dark:text-gray-400">
                        Formulario de creación de usuarios en desarrollo...
                    </p>
                </div>
            </div>
        </AppLayout>
    );
} 