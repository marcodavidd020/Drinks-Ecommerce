import { Link, router } from '@inertiajs/react';
import { useAppMode } from '@/contexts/AppModeContext';
import { useState } from 'react';
import ConfirmDialog from '@/components/ConfirmDialog';

interface ShowHeaderProps {
    title: string;
    description: string;
    editHref?: string;
    backHref: string;
    editText?: string;
    backText?: string;
    canDelete?: boolean;
    deleteAction?: string;
    deleteWarning?: string;
}

export default function ShowHeader({ 
    title, 
    description, 
    editHref, 
    backHref, 
    editText, 
    backText,
    canDelete,
    deleteAction,
    deleteWarning
}: ShowHeaderProps) {
    const { settings } = useAppMode();
    const [confirmDelete, setConfirmDelete] = useState(false);

    const getTextByMode = (textos: { niños: string; jóvenes: string; adultos: string }) => {
        return textos[settings.ageMode as keyof typeof textos] || textos.adultos;
    };

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

    const defaultEditText = getTextByMode({
        niños: 'Editar',
        jóvenes: 'Editar',
        adultos: 'Editar',
    });

    const defaultBackText = getTextByMode({
        niños: 'Volver',
        jóvenes: 'Volver',
        adultos: 'Volver',
    });

    const defaultDeleteText = getTextByMode({
        niños: 'Eliminar',
        jóvenes: 'Eliminar',
        adultos: 'Eliminar',
    });

    const defaultDeleteWarning = getTextByMode({
        niños: '¿Estás seguro de que quieres eliminar esto?',
        jóvenes: '¿Eliminar este elemento?',
        adultos: '¿Está seguro de que desea eliminar este elemento?',
    });

    const handleDelete = () => {
        if (deleteAction) {
            router.delete(deleteAction);
        }
        setConfirmDelete(false);
    };

    return (
        <>
            <div className="flex items-start justify-between">
                <div>
                    <h1 className={`text-3xl font-bold text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>
                        {title}
                    </h1>
                    <p className={`mt-2 text-gray-600 dark:text-gray-400 ${getModeClasses()}`}>
                        {description}
                    </p>
                </div>

                <div className="flex space-x-3">
                    {editHref && (
                        <Link
                            href={editHref}
                            className={`flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 ${getModeClasses()}`}
                        >
                            <span>✏️</span>
                            <span>{editText || defaultEditText}</span>
                        </Link>
                    )}
                    
                    {canDelete && deleteAction && (
                        <button
                            onClick={() => setConfirmDelete(true)}
                            className={`flex items-center space-x-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 ${getModeClasses()}`}
                        >
                            <span>🗑️</span>
                            <span>{defaultDeleteText}</span>
                        </button>
                    )}
                    
                    <Link
                        href={backHref}
                        className={`flex items-center space-x-2 rounded-lg bg-gray-500 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-600 ${getModeClasses()}`}
                    >
                        <span>⬅️</span>
                        <span>{backText || defaultBackText}</span>
                    </Link>
                </div>
            </div>
            
            {canDelete && (
                <ConfirmDialog
                    isOpen={confirmDelete}
                    title={getTextByMode({
                        niños: '¿Estás seguro?',
                        jóvenes: 'Confirmar eliminación',
                        adultos: 'Confirmar eliminación',
                    })}
                    message={deleteWarning || defaultDeleteWarning}
                    confirmText={defaultDeleteText}
                    cancelText={getTextByMode({
                        niños: 'Cancelar',
                        jóvenes: 'Cancelar',
                        adultos: 'Cancelar',
                    })}
                    onConfirm={handleDelete}
                    onCancel={() => setConfirmDelete(false)}
                    type="danger"
                />
            )}
        </>
    );
} 