import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Reportes', href: '/reports' },
];

export default function ReportsIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reportes" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Reportes del Sistema
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Genera y visualiza reportes del negocio.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                            Reporte de Ventas
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Análisis de ventas por periodo
                        </p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                            Reporte de Inventario
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Estado actual del inventario
                        </p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                            Reporte de Clientes
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Análisis de comportamiento de clientes
                        </p>
                    </div>
                </div>
                
                <div className="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <p className="text-gray-500 dark:text-gray-400">
                        Funcionalidad de reportes en desarrollo...
                    </p>
                </div>
            </div>
        </AppLayout>
    );
} 