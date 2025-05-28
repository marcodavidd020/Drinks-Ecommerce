import React, { useState } from 'react';
import { useAppMode, AgeMode, ThemeMode, FontSize, Contrast } from '@/contexts/AppModeContext';
import { 
  Settings, 
  Users, 
  Sun, 
  Moon, 
  Clock, 
  Type, 
  Eye, 
  RotateCcw,
  ChevronDown,
  Baby,
  GraduationCap,
  Briefcase,
  Palette,
  Accessibility
} from 'lucide-react';

const ModeSelector: React.FC = () => {
  const {
    settings,
    updateAgeMode,
    updateThemeMode,
    updateFontSize,
    updateContrast,
    toggleAutoTheme,
    resetToDefaults,
  } = useAppMode();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'age' | 'theme' | 'accessibility'>('age');

  const ageOptions: { value: AgeMode; label: string; icon: React.ReactNode; description: string }[] = [
    {
      value: 'niños',
      label: 'Modo Niños',
      icon: <Baby className="w-5 h-5" />,
      description: 'Interfaz colorida y divertida para los más pequeños'
    },
    {
      value: 'jóvenes',
      label: 'Modo Jóvenes',
      icon: <GraduationCap className="w-5 h-5" />,
      description: 'Diseño moderno y dinámico para adolescentes'
    },
    {
      value: 'adultos',
      label: 'Modo Adultos',
      icon: <Briefcase className="w-5 h-5" />,
      description: 'Interfaz profesional y minimalista'
    },
  ];

  const themeOptions: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { value: 'auto', label: 'Automático', icon: <Clock className="w-5 h-5" /> },
    { value: 'día', label: 'Día', icon: <Sun className="w-5 h-5" /> },
    { value: 'noche', label: 'Noche', icon: <Moon className="w-5 h-5" /> },
  ];

  const fontSizeOptions: { value: FontSize; label: string }[] = [
    { value: 'pequeño', label: 'Pequeño' },
    { value: 'normal', label: 'Normal' },
    { value: 'grande', label: 'Grande' },
    { value: 'extra-grande', label: 'Extra Grande' },
  ];

  const contrastOptions: { value: Contrast; label: string; description: string }[] = [
    { value: 'normal', label: 'Normal', description: 'Contraste estándar' },
    { value: 'alto', label: 'Alto', description: 'Mayor contraste para mejor legibilidad' },
    { value: 'extra-alto', label: 'Extra Alto', description: 'Máximo contraste para accesibilidad' },
  ];

  return (
    <div className="relative">
      {/* Botón para abrir el selector */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
        aria-label="Configurar modos de aplicación"
      >
        <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Modos
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Panel de configuración */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl z-50">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Configuración de Modos
              </h3>
              <button
                onClick={resetToDefaults}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Restablecer valores por defecto"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex mt-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('age')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'age'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                }`}
              >
                <Users className="w-4 h-4" />
                Edad
              </button>
              <button
                onClick={() => setActiveTab('theme')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'theme'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                }`}
              >
                <Palette className="w-4 h-4" />
                Tema
              </button>
              <button
                onClick={() => setActiveTab('accessibility')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'accessibility'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
                }`}
              >
                <Accessibility className="w-4 h-4" />
                Accesibilidad
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Tab Edad */}
            {activeTab === 'age' && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
                  Selecciona tu grupo de edad
                </h4>
                <div className="space-y-2">
                  {ageOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateAgeMode(option.value)}
                      className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        settings.ageMode === option.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 ${settings.ageMode === option.value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                          {option.icon}
                        </div>
                        <div>
                          <div className={`font-medium ${settings.ageMode === option.value ? 'text-blue-900 dark:text-blue-100' : 'text-gray-800 dark:text-gray-200'}`}>
                            {option.label}
                          </div>
                          <div className={`text-sm mt-1 ${settings.ageMode === option.value ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>
                            {option.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab Tema */}
            {activeTab === 'theme' && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3">
                  Configuración de tema
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {themeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateThemeMode(option.value)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        settings.themeMode === option.value
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className={`${settings.themeMode === option.value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`}>
                          {option.icon}
                        </div>
                        <span className={`text-xs font-medium ${settings.themeMode === option.value ? 'text-blue-900 dark:text-blue-100' : 'text-gray-800 dark:text-gray-200'}`}>
                          {option.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                
                {settings.autoTheme && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        Tema actual: <strong>{settings.currentTheme}</strong>
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                      El tema cambia automáticamente según la hora del día (6:00 AM - 6:00 PM = Día)
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tab Accesibilidad */}
            {activeTab === 'accessibility' && (
              <div className="space-y-6">
                {/* Tamaño de fuente */}
                <div>
                  <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Tamaño de fuente
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {fontSizeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateFontSize(option.value)}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          settings.fontSize === option.value
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <span className={`text-sm font-medium ${settings.fontSize === option.value ? 'text-green-900 dark:text-green-100' : 'text-gray-800 dark:text-gray-200'}`}>
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contraste */}
                <div>
                  <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Contraste
                  </h4>
                  <div className="space-y-2">
                    {contrastOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateContrast(option.value)}
                        className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                          settings.contrast === option.value
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <div className={`font-medium ${settings.contrast === option.value ? 'text-purple-900 dark:text-purple-100' : 'text-gray-800 dark:text-gray-200'}`}>
                          {option.label}
                        </div>
                        <div className={`text-sm mt-1 ${settings.contrast === option.value ? 'text-purple-700 dark:text-purple-300' : 'text-gray-500 dark:text-gray-400'}`}>
                          {option.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              La configuración se guarda automáticamente
            </div>
          </div>
        </div>
      )}

      {/* Overlay para cerrar */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ModeSelector; 