import { Link } from '@inertiajs/react';
import { useAppMode } from '@/contexts/AppModeContext';

interface FormButtonsProps {
    cancelHref: string;
    isProcessing?: boolean;
    processing?: boolean;
    cancelText?: string;
    cancelLabel?: string;
    submitText?: string;
    submitLabel?: string;
    processingText?: string;
}

export default function FormButtons({ 
    cancelHref,
    isProcessing,
    processing,
    cancelText,
    cancelLabel,
    submitText,
    submitLabel,
    processingText 
}: FormButtonsProps) {
    const { settings } = useAppMode();
    // Use processing si isProcessing no está definido
    const isProcessingState = isProcessing !== undefined ? isProcessing : (processing || false);

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

    const defaultCancelText = cancelLabel || cancelText || getTextByMode({
        niños: '❌ Cancelar',
        jóvenes: 'Cancelar',
        adultos: 'Cancelar',
    });

    const defaultSubmitText = submitLabel || submitText || getTextByMode({
        niños: '💾 Guardar',
        jóvenes: 'Guardar',
        adultos: 'Guardar',
    });

    const defaultProcessingText = processingText || getTextByMode({
        niños: '⏳ Guardando...',
        jóvenes: 'Guardando...',
        adultos: 'Guardando...',
    });

    return (
        <div className="flex justify-end space-x-4 border-t border-gray-200 pt-6 dark:border-gray-700">
            <Link
                href={cancelHref}
                className={`rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 ${getModeClasses()}`}
            >
                {defaultCancelText}
            </Link>
            <button
                type="submit"
                disabled={isProcessingState}
                className={`rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400 ${getModeClasses()}`}
            >
                {isProcessingState ? defaultProcessingText : defaultSubmitText}
            </button>
        </div>
    );
} 