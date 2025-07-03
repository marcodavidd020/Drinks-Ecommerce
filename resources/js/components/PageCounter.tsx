import { useState } from 'react';
import { usePageCounter } from '../hooks/usePageCounter';
import { Eye, BarChart3, X, RotateCcw } from 'lucide-react';

export default function PageCounter() {
    const { visitCount, totalPages, getPageStats, resetCounters } = usePageCounter();
    const [isExpanded, setIsExpanded] = useState(false);
    const [showStats, setShowStats] = useState(false);

    const stats = getPageStats();

    const handleReset = () => {
        if (confirm('¿Estás seguro de que quieres resetear todos los contadores?')) {
            resetCounters();
            setShowStats(false);
        }
    };

    return (
        <>
            {/* Contador principal - siempre visible */}
            <div className="fixed bottom-4 right-4 z-50">
                <div 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow-lg cursor-pointer transition-all duration-200 flex items-center gap-2"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <Eye size={16} />
                    <span className="text-sm font-medium">
                        {visitCount}
                    </span>
                    {isExpanded && (
                        <span className="text-xs opacity-75">
                            | {totalPages} páginas
                        </span>
                    )}
                </div>

                {/* Panel expandido */}
                {isExpanded && (
                    <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 min-w-[250px]">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                Contador de Páginas
                            </h3>
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Esta página:</span>
                                <span className="font-medium text-blue-600 dark:text-blue-400">
                                    {visitCount} visitas
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Total páginas:</span>
                                <span className="font-medium text-green-600 dark:text-green-400">
                                    {totalPages}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setShowStats(true)}
                                className="flex-1 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded text-xs flex items-center justify-center gap-1"
                            >
                                <BarChart3 size={12} />
                                Stats
                            </button>
                            <button
                                onClick={handleReset}
                                className="flex-1 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded text-xs flex items-center justify-center gap-1"
                            >
                                <RotateCcw size={12} />
                                Reset
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de estadísticas */}
            {showStats && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Estadísticas de Navegación
                            </h2>
                            <button
                                onClick={() => setShowStats(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {stats.totalVisits}
                                </div>
                                <div className="text-sm text-blue-700 dark:text-blue-300">
                                    Total de visitas
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                    <div className="text-xl font-bold text-green-600 dark:text-green-400">
                                        {stats.totalPages}
                                    </div>
                                    <div className="text-xs text-green-700 dark:text-green-300">
                                        Páginas visitadas
                                    </div>
                                </div>

                                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                                    <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                                        {stats.currentPageVisits}
                                    </div>
                                    <div className="text-xs text-purple-700 dark:text-purple-300">
                                        Esta página
                                    </div>
                                </div>
                            </div>

                            {stats.mostVisitedPage.page && (
                                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                                    <div className="text-sm font-medium text-orange-700 dark:text-orange-300 mb-1">
                                        Página más visitada:
                                    </div>
                                    <div className="text-xs text-orange-600 dark:text-orange-400 break-all">
                                        {stats.mostVisitedPage.page}
                                    </div>
                                    <div className="text-xs text-orange-500 dark:text-orange-500 mt-1">
                                        {stats.mostVisitedPage.count} visitas
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowStats(false)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
} 