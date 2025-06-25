import React from 'react';
import { useAppMode } from '@/contexts/AppModeContext';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    type = 'danger'
}: ConfirmDialogProps) {
    const { settings } = useAppMode();

    const getModeClasses = () => {
        switch (settings.ageMode) {
            case 'niños':
                return 'font-comic text-adaptive-kids';
            case 'jóvenes':
                return 'font-modern text-adaptive-teen';
            default:
                return 'font-classic text-adaptive-adult';
        }
    };

    const getTypeClasses = () => {
        switch (type) {
            case 'danger':
                return {
                    icon: '⚠️',
                    iconBg: 'bg-red-100 dark:bg-red-900/20',
                    iconColor: 'text-red-600 dark:text-red-400',
                    confirmBg: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
                };
            case 'warning':
                return {
                    icon: '⚠️',
                    iconBg: 'bg-yellow-100 dark:bg-yellow-900/20',
                    iconColor: 'text-yellow-600 dark:text-yellow-400',
                    confirmBg: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
                };
            default:
                return {
                    icon: 'ℹ️',
                    iconBg: 'bg-blue-100 dark:bg-blue-900/20',
                    iconColor: 'text-blue-600 dark:text-blue-400',
                    confirmBg: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
                };
        }
    };

    if (!isOpen) return null;

    const typeClasses = getTypeClasses();

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Overlay con mejor contraste */}
                <div
                    className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm"
                    onClick={onCancel}
                    aria-hidden="true"
                />

                {/* Centering trick */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                    &#8203;
                </span>

                {/* Modal panel con mejor visibilidad */}
                <div className="relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 border border-gray-200 dark:border-gray-700">
                    <div className="sm:flex sm:items-start">
                        <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${typeClasses.iconBg} sm:mx-0 sm:h-10 sm:w-10 border-2 border-transparent`}>
                            <span className={`text-xl ${typeClasses.iconColor}`}>
                                {typeClasses.icon}
                            </span>
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 className={`text-lg leading-6 font-medium text-gray-900 dark:text-white ${getModeClasses()}`} id="modal-title">
                                {title}
                            </h3>
                            <div className="mt-2">
                                <p className={`text-sm text-gray-600 dark:text-gray-300 ${getModeClasses()}`}>
                                    {message}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                        <button
                            type="button"
                            className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${typeClasses.confirmBg} text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm transition-colors ${getModeClasses()}`}
                            onClick={onConfirm}
                        >
                            {confirmText || 'Confirmar'}
                        </button>
                        <button
                            type="button"
                            className={`mt-3 sm:mt-0 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm transition-colors ${getModeClasses()}`}
                            onClick={onCancel}
                        >
                            {cancelText || 'Cancelar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 