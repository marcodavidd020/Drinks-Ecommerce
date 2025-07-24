import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Calendar, TrendingUp, Package, DollarSign } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppModeText } from '@/hooks/useAppModeText';
import { formatCurrency } from '@/lib/currency';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

// Registrar componentes de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

// Helper function to generate correct URLs for production
const getAppUrl = (path: string) => {
    const appUrl = import.meta.env.PROD 
        ? '/inf513/grupo21sc/Drinks-Ecommerce/public' 
        : '';
    return appUrl + path;
};

interface Proveedor {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
}

interface DetalleCompra {
  id: number;
  cantidad: number;
  precio: string;
  total: string;
  producto_almacen: {
    producto: {
      id: number;
      nombre: string;
      precio: string;
    };
  };
}

interface NotaCompra {
  id: number;
  fecha: string;
  total: string;
  observaciones: string;
  proveedor: Proveedor;
  detalles: DetalleCompra[];
}

interface PurchasesByCategory {
  categoria: string;
  total: string;
}

interface PurchasesPageProps {
  notas: NotaCompra[];
  totalAmount: string;
  totalPurchases: number;
  averageAmount: string;
  purchasesByCategory: PurchasesByCategory[];
  startDate: string;
  endDate: string;
}

export default function Purchases({ 
  notas = [], 
  totalAmount = '0', 
  totalPurchases = 0, 
  averageAmount = '0', 
  purchasesByCategory = [],
  startDate = '',
  endDate = ''
}: PurchasesPageProps) {
  const [filters, setFilters] = useState({
    startDate: startDate || '',
    endDate: endDate || ''
  });

  const { getTextByMode, getModeClasses } = useAppModeText();

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('start_date', filters.startDate);
    if (filters.endDate) params.append('end_date', filters.endDate);
    
    window.location.href = `${getAppUrl('/reports/purchases')}?${params.toString()}`;
  };

  const downloadPDF = () => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('start_date', filters.startDate);
    if (filters.endDate) params.append('end_date', filters.endDate);
    
    window.open(`${getAppUrl('/reports/purchases/pdf')}?${params.toString()}`, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Preparar datos para las gráficas
  const categoryChartData = {
    labels: purchasesByCategory.map(cat => cat.categoria),
    datasets: [
      {
        label: getTextByMode({
          niños: 'Compras por Categoría',
          jóvenes: 'Compras por Categoría',
          adultos: 'Compras por Categoría'
        }),
        data: purchasesByCategory.map(cat => parseFloat(cat.total)),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Gráfico de tendencias de compras por fecha
  const purchasesByDate = notas.reduce((acc, nota) => {
    const date = formatDate(nota.fecha);
    acc[date] = (acc[date] || 0) + parseFloat(nota.total);
    return acc;
  }, {} as Record<string, number>);

  const trendChartData = {
    labels: Object.keys(purchasesByDate).slice(-10), // Últimas 10 fechas
    datasets: [
      {
        label: getTextByMode({
          niños: 'Tendencia de Compras',
          jóvenes: 'Tendencia de Compras',
          adultos: 'Tendencia de Compras'
        }),
        data: Object.values(purchasesByDate).slice(-10),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Gráfico de dona para distribución por proveedor
  const purchasesByProvider = notas.reduce((acc, nota) => {
    acc[nota.proveedor.nombre] = (acc[nota.proveedor.nombre] || 0) + parseFloat(nota.total);
    return acc;
  }, {} as Record<string, number>);

  const providerChartData = {
    labels: Object.keys(purchasesByProvider),
    datasets: [
      {
        data: Object.values(purchasesByProvider),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#374151', // Color fijo para mejor legibilidad
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#374151',
        },
        grid: {
          color: '#e5e7eb',
        },
      },
      x: {
        ticks: {
          color: '#374151',
        },
        grid: {
          color: '#e5e7eb',
        },
      },
    },
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        ticks: {
          ...chartOptions.scales.y.ticks,
          callback: function(value: any) {
            return 'Bs ' + value.toLocaleString();
          }
        }
      }
    }
  };

  const title = getTextByMode({
    niños: '📦 Reporte de Compras',
    jóvenes: '📦 Reporte de Compras',
    adultos: 'Reporte de Compras'
  });

  return (
    <DashboardLayout title={title}>
      <Head title={title} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100 ${getModeClasses()}`}>{title}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {getTextByMode({
              niños: '¡Mira cuántas bebidas hemos comprado!',
              jóvenes: 'Análisis detallado de las compras',
              adultos: 'Análisis detallado de las compras realizadas'
            })}
          </p>
        </div>

        {/* Filtros */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Fecha inicio
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Fecha fin
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={applyFilters} className="w-full">
                  Aplicar Filtros
                </Button>
              </div>
              <div className="flex items-end">
                <Button onClick={downloadPDF} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {getTextByMode({
                  niños: 'Total Gastado',
                  jóvenes: 'Total Gastado',
                  adultos: 'Total Gastado'
                })}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(parseFloat(totalAmount))}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {getTextByMode({
                  niños: 'Compras Realizadas',
                  jóvenes: 'Total de Compras',
                  adultos: 'Total de Compras'
                })}
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPurchases}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {getTextByMode({
                  niños: 'Promedio por Compra',
                  jóvenes: 'Promedio por Compra',
                  adultos: 'Promedio por Compra'
                })}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(parseFloat(averageAmount))}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfico de barras - Compras por categoría */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${getModeClasses()}`}>
                📊 {getTextByMode({
                  niños: 'Compras por Tipo de Bebida',
                  jóvenes: 'Compras por Categoría',
                  adultos: 'Compras por Categoría'
                })}
              </CardTitle>
              <CardDescription>
                Distribución de compras según categoría de productos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Bar data={categoryChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de línea - Tendencia de compras */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${getModeClasses()}`}>
                📈 {getTextByMode({
                  niños: 'Tendencia de Compras',
                  jóvenes: 'Tendencia de Compras',
                  adultos: 'Tendencia de Compras'
                })}
              </CardTitle>
              <CardDescription>
                Evolución de las compras en el tiempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Line data={trendChartData} options={lineChartOptions} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de dona - Distribución por proveedor */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${getModeClasses()}`}>
              🍩 {getTextByMode({
                niños: 'Compras por Proveedor',
                jóvenes: 'Distribución por Proveedor',
                adultos: 'Distribución por Proveedor'
              })}
            </CardTitle>
            <CardDescription>
              Proporción de compras realizadas a cada proveedor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="w-80 h-80">
                <Doughnut data={providerChartData} options={chartOptions} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Purchases by Category Cards */}
        {purchasesByCategory.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className={getModeClasses()}>
                {getTextByMode({
                  niños: '🏷️ Detalle por Tipo de Bebida',
                  jóvenes: '🏷️ Detalle por Categoría',
                  adultos: 'Detalle por Categoría'
                })}
              </CardTitle>
              <CardDescription>
                {getTextByMode({
                  niños: 'Lista de todas las bebidas que hemos comprado',
                  jóvenes: 'Compras ordenadas por categoría de productos',
                  adultos: 'Análisis de compras por categoría de productos'
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {purchasesByCategory.map((category, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {category.categoria}
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(parseFloat(category.total))}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="text-sm text-gray-500">
                        {parseFloat(totalAmount) > 0 ?
                          ((parseFloat(category.total) / parseFloat(totalAmount)) * 100).toFixed(1)
                          : 0}% del total
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Purchases Table */}
        <Card>
          <CardHeader>
            <CardTitle className={getModeClasses()}>
              {getTextByMode({
                niños: '📋 Lista de Todas las Compras',
                jóvenes: '📋 Detalle de Compras',
                adultos: 'Detalle de Compras'
              })}
            </CardTitle>
            <CardDescription>
              {getTextByMode({
                niños: 'Lista de todas las compras que hemos hecho',
                jóvenes: 'Compras ordenadas por fecha',
                adultos: 'Análisis detallado de todas las compras realizadas'
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notas.map((nota, index) => (
                <div key={nota.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                        <div className="font-semibold">{nota.proveedor.nombre}</div>
                        <Badge variant="secondary">
                          {nota.detalles.length} productos
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">
                        {nota.proveedor.email}
                      </div>
                      {nota.proveedor.telefono && (
                        <div className="text-sm text-muted-foreground mb-1">
                          {nota.proveedor.telefono}
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">
                        <strong>Fecha de compra:</strong> {formatDate(nota.fecha)}
                      </div>
                      {nota.observaciones && (
                        <div className="text-sm text-muted-foreground mt-1">
                          <strong>Observaciones:</strong> {nota.observaciones}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{formatCurrency(parseFloat(nota.total))}</div>
                      <div className="text-sm text-muted-foreground">
                        {nota.detalles.length} productos
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{nota.detalles.length}</div>
                      <div className="text-sm text-muted-foreground">
                        {getTextByMode({
                          niños: 'Productos',
                          jóvenes: 'Productos',
                          adultos: 'Productos'
                        })}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(parseFloat(nota.total) / nota.detalles.length)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {getTextByMode({
                          niños: 'Promedio',
                          jóvenes: 'Promedio por producto',
                          adultos: 'Promedio por producto'
                        })}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {formatCurrency(parseFloat(nota.total))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {getTextByMode({
                          niños: 'Total gastado',
                          jóvenes: 'Valor total',
                          adultos: 'Valor total'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {notas.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {getTextByMode({
                  niños: 'No hay compras para mostrar',
                  jóvenes: 'No se encontraron compras en este período',
                  adultos: 'No hay datos de compras disponibles para el período seleccionado'
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
