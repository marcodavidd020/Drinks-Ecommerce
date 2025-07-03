import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Calendar, TrendingUp, Package, DollarSign } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppModeText } from '@/hooks/useAppModeText';
import { formatCurrency } from '@/lib/currency';

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

  const { getTextByMode } = useAppModeText();

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('start_date', filters.startDate);
    if (filters.endDate) params.append('end_date', filters.endDate);
    
    window.location.href = `/reports/purchases?${params.toString()}`;
  };

  const downloadPDF = () => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('start_date', filters.startDate);
    if (filters.endDate) params.append('end_date', filters.endDate);
    
    window.open(`/reports/purchases/pdf?${params.toString()}`, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const title = getTextByMode({
    niños: 'Reportes de Compras',
    jóvenes: 'Reportes de Compras',
    adultos: 'Reportes de Compras'
  });

  return (
    <DashboardLayout
      title={title}
    >
      <Head title={title} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground">
            {getTextByMode({
              niños: 'Mira todas las compras que hemos hecho',
              jóvenes: 'Revisa los reportes de compras del negocio',
              adultos: 'Análisis detallado de compras y proveedores'
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
                  niños: 'Total gastado',
                  jóvenes: 'Total en compras',
                  adultos: 'Total invertido'
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
                  niños: 'Compras hechas',
                  jóvenes: 'Número de compras',
                  adultos: 'Órdenes de compra'
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
                  niños: 'Promedio por compra',
                  jóvenes: 'Compra promedio',
                  adultos: 'Ticket promedio'
                })}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(parseFloat(averageAmount))}</div>
            </CardContent>
          </Card>
        </div>

        {/* Compras por categoría */}
        {purchasesByCategory.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {getTextByMode({
                  niños: 'Compras por tipo',
                  jóvenes: 'Compras por categoría',
                  adultos: 'Distribución por categoría'
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purchasesByCategory.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="font-medium">{category.categoria}</div>
                    <div className="text-right">
                      <div className="font-bold">{formatCurrency(parseFloat(category.total))}</div>
                      <div className="text-sm text-muted-foreground">
                        {(parseFloat(category.total) / parseFloat(totalAmount) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de compras */}
        <Card>
          <CardHeader>
            <CardTitle>
              {getTextByMode({
                niños: 'Lista de compras',
                jóvenes: 'Historial de compras',
                adultos: 'Detalle de compras'
              })}
            </CardTitle>
            <CardDescription>
              {getTextByMode({
                niños: 'Todas las compras que hemos hecho',
                jóvenes: 'Listado completo de compras realizadas',
                adultos: 'Registro detallado de todas las órdenes de compra'
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notas.map((nota) => (
                <div key={nota.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold">Compra #{nota.id}</div>
                      <div className="text-sm text-muted-foreground">{formatDate(nota.fecha)}</div>
                      <div className="text-sm">
                        <strong>Proveedor:</strong> {nota.proveedor.nombre}
                      </div>
                      {nota.proveedor.email && (
                        <div className="text-sm text-muted-foreground">
                          {nota.proveedor.email}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{formatCurrency(parseFloat(nota.total))}</div>
                      <Badge variant="secondary">
                        {nota.detalles.length} productos
                      </Badge>
                    </div>
                  </div>
                  
                  {nota.observaciones && (
                    <div className="mb-3 p-3 bg-muted rounded-md">
                      <strong>Observaciones:</strong> {nota.observaciones}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    {nota.detalles.map((detalle) => (
                      <div key={detalle.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <div className="flex-1">
                          <div className="font-medium">{detalle.producto_almacen.producto.nombre}</div>
                          <div className="text-sm text-muted-foreground">
                            {detalle.cantidad} x {formatCurrency(parseFloat(detalle.precio))}
                          </div>
                        </div>
                        <div className="font-semibold">
                          {formatCurrency(parseFloat(detalle.total))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {notas.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {getTextByMode({
                  niños: 'No hay compras para mostrar',
                  jóvenes: 'No se encontraron compras en este período',
                  adultos: 'No hay órdenes de compra registradas para el período seleccionado'
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
