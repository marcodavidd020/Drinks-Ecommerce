import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Permisos', href: '/admin/permissions' },
];

export default function Permissions() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Permisos" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Gestión de Permisos
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Administra los permisos del sistema.
                    </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <p className="text-gray-500 dark:text-gray-400">
                        Funcionalidad de gestión de permisos en desarrollo...
                    </p>
                </div>
            </div>
        </AppLayout>
    );
} 