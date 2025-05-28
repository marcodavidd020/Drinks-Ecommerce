# Sistema de Modos Adaptativos para Laravel + React

Este documento describe el sistema completo de modos adaptativos implementado en la aplicación, que incluye modos por grupos de edad, temas día/noche automáticos y opciones de accesibilidad.

## 🌟 Características Principales

### 1. **Modos por Grupos de Edad**
- **Modo Niños**: Interfaz colorida, divertida y fácil de usar
- **Modo Jóvenes**: Diseño moderno con gradientes y efectos visuales
- **Modo Adultos**: Interfaz profesional y minimalista

### 2. **Tema Día/Noche Automático**
- Cambia automáticamente según la hora del día
- Horario configurable: 6:00 AM - 6:00 PM = Día
- Opción manual para forzar un tema específico

### 3. **Accesibilidad**
- **Tamaños de fuente**: Pequeño, Normal, Grande, Extra Grande
- **Contraste**: Normal, Alto, Extra Alto
- Compatible con lectores de pantalla
- Respeta las preferencias del sistema del usuario

## 🏗️ Arquitectura del Sistema

### Estructura de Archivos

```
resources/
├── js/
│   ├── contexts/
│   │   └── AppModeContext.tsx          # Contexto principal de modos
│   ├── components/
│   │   └── ModeSelector.tsx            # Selector de modos UI
│   ├── layouts/
│   │   └── AppLayout.tsx               # Layout con selector integrado
│   └── pages/
│       └── ModesDemo.tsx               # Página de demostración
├── css/
│   ├── app.css                         # CSS principal
│   └── modes.css                       # Estilos específicos de modos
└── views/
    └── app.blade.php                   # Template base
```

### Componentes Principales

#### 1. **AppModeContext** (`contexts/AppModeContext.tsx`)
- Maneja el estado global de todos los modos
- Persiste configuraciones en `localStorage`
- Actualiza automáticamente el tema según la hora
- Aplica clases CSS dinámicamente al `document.documentElement`

#### 2. **ModeSelector** (`components/ModeSelector.tsx`)
- Interfaz de usuario para cambiar entre modos
- Organizado en tabs: Edad, Tema, Accesibilidad
- Feedback visual del estado actual
- Botón de reset a valores por defecto

#### 3. **AppLayout** (`layouts/AppLayout.tsx`)
- Layout base que incluye el selector de modos
- Indicador de desarrollo para mostrar configuración actual
- Header configurable

## 🎨 Sistema de Estilos

### Variables CSS Dinámicas

Cada modo define variables CSS que se aplicam automáticamente:

```css
.mode-niños {
  --primary-color: #ff6b6b;
  --secondary-color: #4ecdc4;
  --accent-color: #ffe66d;
  /* ... */
}
```

### Clases Adaptativas

- `.btn-adaptive`: Botones que se adaptan al modo
- `.card-adaptive`: Tarjetas con estilos específicos por edad
- `.text-adaptive`: Texto con tipografía adaptativa

### Tailwind CSS Personalizado

El archivo `tailwind.config.js` incluye:
- Fuentes específicas para cada grupo de edad
- Paletas de colores adaptativas
- Tamaños de fuente escalables
- Utilidades CSS personalizadas

## 🚀 Uso del Sistema

### 1. Configuración Básica

```tsx
import { AppModeProvider } from '@/contexts/AppModeContext';

function App() {
  return (
    <AppModeProvider>
      {/* Tu aplicación */}
    </AppModeProvider>
  );
}
```

### 2. Usar el Hook en Componentes

```tsx
import { useAppMode } from '@/contexts/AppModeContext';

function MiComponente() {
  const { settings, updateAgeMode } = useAppMode();
  
  return (
    <div className={`mode-${settings.ageMode}`}>
      <h1 className="text-adaptive">¡Hola mundo!</h1>
      <button 
        className="btn-adaptive btn-primary"
        onClick={() => updateAgeMode('niños')}
      >
        Cambiar a modo niños
      </button>
    </div>
  );
}
```

### 3. Aplicar Estilos Adaptativos

```tsx
// Componente que se adapta automáticamente
<div className="card-adaptive p-6">
  <h3 className="text-adaptive">Título</h3>
  <p className="text-adaptive">Contenido adaptativo</p>
</div>
```

## 🎯 Configuraciones por Modo

### Modo Niños 👶
- **Fuente**: Comic Neue (estilo divertido)
- **Colores**: Rojos, turquesas y amarillos vibrantes
- **Efectos**: Animaciones suaves, bordes redondeados
- **Interacciones**: Hover con escala y rotación

### Modo Jóvenes 🚀
- **Fuente**: Poppins (moderna y limpia)
- **Colores**: Gradientes púrpura y azul
- **Efectos**: Glassmorphism, efectos de blur
- **Interacciones**: Transiciones con brillo

### Modo Adultos 💼
- **Fuente**: Inter (profesional)
- **Colores**: Grises y azules corporativos
- **Efectos**: Sombras sutiles, diseño limpio
- **Interacciones**: Movimientos mínimos y precisos

## 🌓 Sistema de Temas

### Detección Automática
```typescript
const isDayTime = (): boolean => {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18;
};
```

### Variables de Tema
```css
.theme-día {
  --theme-bg: #ffffff;
  --theme-text: #1a202c;
  /* ... */
}

.theme-noche {
  --theme-bg: #1a202c;
  --theme-text: #f7fafc;
  /* ... */
}
```

## ♿ Accesibilidad

### Características Implementadas
- **ARIA Labels**: Etiquetas descriptivas en controles
- **Navegación por teclado**: Completamente funcional
- **Lectores de pantalla**: Compatible
- **Preferencias del sistema**: Respeta `prefers-reduced-motion` y `prefers-contrast`

### Niveles de Contraste
1. **Normal**: Contraste estándar
2. **Alto**: Filtro `contrast(1.5)`
3. **Extra Alto**: Filtro `contrast(2)` + `brightness(1.2)`

### Tamaños de Fuente Escalables
- **Pequeño**: 0.8rem base
- **Normal**: 1rem base
- **Grande**: 1.2rem base  
- **Extra Grande**: 1.4rem base

## 🔧 Personalización

### Agregar Nuevo Modo de Edad

1. Actualizar tipos en `AppModeContext.tsx`:
```typescript
export type AgeMode = 'niños' | 'jóvenes' | 'adultos' | 'seniors';
```

2. Agregar estilos en `modes.css`:
```css
.mode-seniors {
  --primary-color: #065f46;
  /* ... */
}
```

3. Actualizar `ModeSelector.tsx` con la nueva opción.

### Personalizar Horarios de Tema
Modificar la función `isDayTime()` en `AppModeContext.tsx`:
```typescript
const isDayTime = (): boolean => {
  const hour = new Date().getHours();
  return hour >= 7 && hour < 19; // 7 AM - 7 PM
};
```

## 📱 Responsive Design

### Breakpoints Adaptativos
```css
@media (max-width: 640px) {
  .mode-niños .card {
    border-width: 3px;
    padding: 1.5rem;
  }
}
```

### Dispositivos Táctiles
```css
@media (hover: none) {
  .btn-adaptive:hover {
    transform: none !important;
  }
}
```

## 🧪 Página de Demostración

Visita `/demo-modos` para ver todas las características en acción:
- Intercambio dinámico entre modos
- Ejemplos de componentes adaptativos
- Demostración de accesibilidad
- Visualización de configuración actual

## 🚀 Implementación en Producción

### 1. Variables de Entorno
```env
VITE_APP_NAME="Mi Aplicación"
```

### 2. Compilación
```bash
npm run build
```

### 3. Cache de Navegador
Las configuraciones se guardan automáticamente en `localStorage` y persisten entre sesiones.

## 🤝 Contribuir

Para agregar nuevas características:

1. **Nuevos modos**: Actualizar contexto, estilos y selector
2. **Nuevos temas**: Agregar variables CSS y detección de condiciones
3. **Opciones de accesibilidad**: Expandir filtros CSS y utilidades

## 📋 Checklist de Implementación

- [x] Contexto de modos global
- [x] Selector de modos UI  
- [x] Estilos adaptativos CSS
- [x] Tema día/noche automático
- [x] Configuraciones de accesibilidad
- [x] Persistencia en localStorage
- [x] Layout base integrado
- [x] Página de demostración
- [x] Responsive design
- [x] Documentación completa

## 🎉 ¡Listo para usar!

El sistema está completamente implementado y listo para producción. Los usuarios pueden personalizar su experiencia según sus preferencias y necesidades de accesibilidad. 