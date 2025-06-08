# 📊 Dashboard - Documentación

Este proyecto incluye **dos versiones del dashboard** con diferentes tecnologías:

## 🎯 **Versiones Disponibles**

### 1. **Dashboard Blade + Livewire** (Actual)
- **Ruta**: `/dashboard`
- **Tecnologías**: Laravel Blade + Livewire + React (componentes específicos)
- **Estado**: ✅ **Activo y funcionando**

### 2. **Dashboard React Puro** (Nuevo)
- **Ruta**: `/dashboard-react`
- **Tecnologías**: Inertia.js + React + TypeScript
- **Estado**: ✅ **Disponible y funcional**

---

## 🔧 **Características del Dashboard**

### **Métricas Principales**
- 💰 Total de Ventas
- 👥 Total de Clientes  
- 📦 Total de Productos
- 🏢 Total de Proveedores

### **Métricas de Alerta**
- ⚠️ PQRS Pendientes
- 🛒 Carritos Abandonados
- 📉 Stock Crítico

### **Gráficas Interactivas**
- 📈 Ventas por Mes (Chart.js)
- 🍩 Productos Más Vendidos

### **Tablas de Datos**
- 🛒 Ventas Recientes
- 📦 Stock Crítico
- 📋 PQRS Recientes

---

## 🚀 **Cómo Acceder**

### **Dashboard Blade + Livewire**
```
https://tu-dominio.com/dashboard
```

### **Dashboard React Puro**
```
https://tu-dominio.com/dashboard-react
```

---

## 🛠 **Tecnologías Utilizadas**

### **Versión Blade + Livewire**
- ⚡ **Livewire**: Reactivity en tiempo real
- 🎨 **Tailwind CSS**: Estilos
- ⚛️ **React**: Componentes específicos (métricas y gráficas)
- 📊 **Chart.js**: Gráficas interactivas

### **Versión React Pura**
- ⚛️ **React 18**: Framework frontend
- 📝 **TypeScript**: Tipado estático
- 🌐 **Inertia.js**: Bridge Laravel-React
- 🎨 **Tailwind CSS**: Framework CSS
- 📊 **Chart.js + react-chartjs-2**: Gráficas

---

## 🔐 **Permisos Requeridos**

Ambas versiones requieren:
- ✅ Usuario autenticado
- ✅ Email verificado
- ✅ Permiso: `ACCESO_DASHBOARD`

---

## 📂 **Estructura de Archivos**

### **Dashboard Blade + Livewire**
```
resources/views/dashboard.blade.php
app/Livewire/Dashboard/MetricasWidget.php
resources/views/livewire/dashboard/metricas-widget.blade.php
resources/js/dashboard.tsx
```

### **Dashboard React Puro**
```
resources/js/Pages/Dashboard.tsx
resources/js/components/dashboard/MetricCard.tsx
resources/js/components/dashboard/ChartCard.tsx
resources/js/components/dashboard/DataTable.tsx
app/Http/Controllers/DashboardController.php (método react)
```

---

## 🏗 **Componentes React Reutilizables**

### **MetricCard.tsx**
```typescript
interface MetricCardProps {
    title: string;
    value: string;
    subtitle?: string;
    icon?: string;
    colorClass?: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
}
```

### **ChartCard.tsx**
```typescript
interface ChartCardProps {
    title: string;
    data: ChartData;
    type: 'line' | 'bar' | 'doughnut' | 'pie';
    height?: number;
}
```

### **DataTable.tsx**
```typescript
interface DataTableProps {
    title: string;
    columns: Column[];
    data: any[];
    emptyMessage?: string;
    badge?: { text: string; color: string };
}
```

---

## ⚙️ **Configuración de Desarrollo**

### **Compilar Assets**
```bash
# Desarrollo
npm run dev

# Producción
npm run build
```

### **Ejecutar Tests**
```bash
# Tests específicos del dashboard
php artisan test --filter="DashboardTest|ChartDataTest"

# Todos los tests
php artisan test
```

---

## 🎨 **Temas y Apariencia**

Ambas versiones soportan:
- 🌞 **Modo Claro**
- 🌙 **Modo Oscuro** 
- 🔄 **Modo Sistema** (automático)

El tema se sincroniza entre ambas versiones usando:
- `localStorage` en el frontend
- Cookies en el backend
- Hook `useAppearance` personalizado

---

## 📈 **Datos del Dashboard**

### **Fuentes de Datos**
- `NotaVenta`: Ventas y métricas de ingresos
- `Cliente`: Información de clientes
- `Producto`: Catálogo de productos
- `Proveedor`: Base de proveedores
- `Pqrsona`: PQRS y atención al cliente
- `Carrito`: Carritos de compras
- `Stock`: Inventario y stock crítico

### **Actualización de Datos**
- **Blade + Livewire**: ⚡ Tiempo real con Livewire
- **React Puro**: 🔄 Requiere refresh manual

---

## 🔍 **Diferencias Principales**

| Característica | Blade + Livewire | React Puro |
|----------------|------------------|------------|
| **Reactividad** | ⚡ Tiempo real | 🔄 Manual |
| **Performance** | 🚀 Rápido | 🚀 Muy rápido |
| **SEO** | ✅ Excelente | ⚠️ SPA |
| **Desarrollo** | 🔧 Laravel-first | ⚛️ React-first |
| **Complejidad** | 🟢 Baja | 🟡 Media |

---

## 🎯 **Recomendaciones de Uso**

### **Usa Dashboard Blade + Livewire si:**
- ✅ Necesitas actualizaciones en tiempo real
- ✅ Tu equipo domina Laravel/Blade
- ✅ Priorizas el SEO
- ✅ Quieres menor complejidad

### **Usa Dashboard React Puro si:**
- ⚛️ Tu equipo domina React/TypeScript
- 🚀 Priorizas la performance del frontend
- 🔧 Planeas expandir como SPA
- 📱 Necesitas máxima interactividad

---

## 🐛 **Resolución de Problemas**

### **Error de Compilación**
```bash
npm run build
```

### **Error de Permisos**
Verificar que el usuario tenga el permiso `ACCESO_DASHBOARD`:
```php
$user->givePermissionTo('acceso_dashboard');
```

### **Error de Datos**
Verificar que existan las tablas y relaciones necesarias:
```bash
php artisan migrate
php artisan db:seed
```

---

## 📞 **Soporte**

- 📧 Email: soporte@empresa.com
- 📱 WhatsApp: +57 xxx xxx xxxx
- 🌐 Documentación: `/docs`

---

**¡Ambas versiones están listas para producción!** 🚀 