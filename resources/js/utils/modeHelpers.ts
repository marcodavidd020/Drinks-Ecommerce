import { useAppMode } from '@/contexts/AppModeContext';

export interface ModeTexts {
    niños: string;
    jóvenes: string;
    adultos: string;
}

export const useTextByMode = () => {
    const { settings } = useAppMode();
    
    return (textos: ModeTexts) => {
        return textos[settings.ageMode as keyof typeof textos] || textos.adultos;
    };
};

export const useModeClasses = () => {
    const { settings } = useAppMode();
    
    return () => {
        switch (settings.ageMode) {
            case 'niños':
                return 'font-comic text-adaptive-kids';
            case 'jóvenes':
                return 'font-modern text-adaptive-teen';
            default:
                return 'font-classic text-adaptive-adult';
        }
    };
};

export const getModeIcon = (mode: string) => {
    switch (mode) {
        case 'niños':
            return '😊';
        case 'jóvenes':
            return '👤';
        default:
            return '👁️';
    }
}; 