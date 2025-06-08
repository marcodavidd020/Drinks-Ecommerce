import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type AgeMode = 'niños' | 'jóvenes' | 'adultos';
export type ThemeMode = 'día' | 'noche' | 'auto';
export type FontSize = 'pequeño' | 'normal' | 'grande' | 'extra-grande';
export type Contrast = 'normal' | 'alto' | 'extra-alto';

export interface AppModeSettings {
  ageMode: AgeMode;
  themeMode: ThemeMode;
  fontSize: FontSize;
  contrast: Contrast;
  autoTheme: boolean;
  currentTheme: 'día' | 'noche';
}

interface AppModeContextType {
  settings: AppModeSettings;
  updateAgeMode: (mode: AgeMode) => void;
  updateThemeMode: (mode: ThemeMode) => void;
  updateFontSize: (size: FontSize) => void;
  updateContrast: (contrast: Contrast) => void;
  toggleAutoTheme: () => void;
  resetToDefaults: () => void;
}

const defaultSettings: AppModeSettings = {
  ageMode: 'adultos',
  themeMode: 'auto',
  fontSize: 'normal',
  contrast: 'normal',
  autoTheme: true,
  currentTheme: 'día',
};

const AppModeContext = createContext<AppModeContextType | undefined>(undefined);

// Función para determinar si es de día o noche
const isDayTime = (): boolean => {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18; // Día: 6:00 AM - 6:00 PM
};

// Función para cargar configuraciones desde localStorage
const loadSettings = (): AppModeSettings => {
  try {
    const saved = localStorage.getItem('appModeSettings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...defaultSettings,
        ...parsed,
        currentTheme: parsed.autoTheme ? (isDayTime() ? 'día' : 'noche') : parsed.currentTheme,
      };
    }
  } catch (error) {
    console.error('Error loading app mode settings:', error);
  }
  
  return {
    ...defaultSettings,
    currentTheme: isDayTime() ? 'día' : 'noche',
  };
};

// Función para guardar configuraciones en localStorage
const saveSettings = (settings: AppModeSettings) => {
  try {
    localStorage.setItem('appModeSettings', JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving app mode settings:', error);
  }
};

interface AppModeProviderProps {
  children: ReactNode;
}

export const AppModeProvider: React.FC<AppModeProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AppModeSettings>(loadSettings);

  // Actualizar tema automático cada minuto
  useEffect(() => {
    if (!settings.autoTheme) return;

    const updateAutoTheme = () => {
      const newTheme = isDayTime() ? 'día' : 'noche';
      if (newTheme !== settings.currentTheme) {
        setSettings(prev => ({
          ...prev,
          currentTheme: newTheme,
        }));
      }
    };

    // Verificar inmediatamente
    updateAutoTheme();

    // Verificar cada minuto
    const interval = setInterval(updateAutoTheme, 60000);

    return () => clearInterval(interval);
  }, [settings.autoTheme, settings.currentTheme]);

  // Guardar configuraciones cuando cambien
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Aplicar clases CSS al document.documentElement
  useEffect(() => {
    const root = document.documentElement;
    
    // Remover todas las clases de modo
    root.classList.remove(
      'mode-niños', 'mode-jóvenes', 'mode-adultos',
      'theme-día', 'theme-noche',
      'font-pequeño', 'font-normal', 'font-grande', 'font-extra-grande',
      'contrast-normal', 'contrast-alto', 'contrast-extra-alto'
    );

    // Aplicar nuevas clases
    root.classList.add(`mode-${settings.ageMode}`);
    root.classList.add(`theme-${settings.currentTheme}`);
    root.classList.add(`font-${settings.fontSize}`);
    root.classList.add(`contrast-${settings.contrast}`);

    // Aplicar variables CSS personalizadas
    root.style.setProperty('--app-age-mode', settings.ageMode);
    root.style.setProperty('--app-theme-mode', settings.currentTheme);
    root.style.setProperty('--app-font-size', settings.fontSize);
    root.style.setProperty('--app-contrast', settings.contrast);
  }, [settings]);

  const updateAgeMode = (mode: AgeMode) => {
    setSettings(prev => ({ ...prev, ageMode: mode }));
  };

  const updateThemeMode = (mode: ThemeMode) => {
    setSettings(prev => ({
      ...prev,
      themeMode: mode,
      autoTheme: mode === 'auto',
      currentTheme: mode === 'auto' ? (isDayTime() ? 'día' : 'noche') : mode,
    }));
  };

  const updateFontSize = (size: FontSize) => {
    setSettings(prev => ({ ...prev, fontSize: size }));
  };

  const updateContrast = (contrast: Contrast) => {
    setSettings(prev => ({ ...prev, contrast }));
  };

  const toggleAutoTheme = () => {
    setSettings(prev => ({
      ...prev,
      autoTheme: !prev.autoTheme,
      themeMode: !prev.autoTheme ? 'auto' : prev.currentTheme,
      currentTheme: !prev.autoTheme ? (isDayTime() ? 'día' : 'noche') : prev.currentTheme,
    }));
  };

  const resetToDefaults = () => {
    setSettings({
      ...defaultSettings,
      currentTheme: isDayTime() ? 'día' : 'noche',
    });
  };

  const value: AppModeContextType = {
    settings,
    updateAgeMode,
    updateThemeMode,
    updateFontSize,
    updateContrast,
    toggleAutoTheme,
    resetToDefaults,
  };

  return (
    <AppModeContext.Provider value={value}>
      {children}
    </AppModeContext.Provider>
  );
};

export const useAppMode = (): AppModeContextType => {
  const context = useContext(AppModeContext);
  if (context === undefined) {
    throw new Error('useAppMode debe ser usado dentro de un AppModeProvider');
  }
  return context;
}; 