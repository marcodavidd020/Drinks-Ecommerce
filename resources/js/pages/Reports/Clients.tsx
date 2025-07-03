import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Calendar, TrendingUp, Users, DollarSign, ShoppingCart } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAppModeText } from '@/hooks/useAppModeText';
import { formatCurrency } from '@/lib/currency';

interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  total_compras: string;
  numero_compras: number;
  promedio_compra: string;
  fecha_ultima_compra: string;
}

interface ClientsPageProps {
  clientes: Cliente[];
  totalClientes: number;
  clientesActivos: number;
  promedioComprasPorCliente: string;
  startDate: string;
  endDate: string;
}

export default function Clients({ 
  clientes = [], 
  totalClientes = 0, 
  clientesActivos = 0, 
  promedioComprasPorCliente = '0',
  startDate = '',
  endDate = ''
}: ClientsPageProps) {
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
    
    window.location.href = `/reports/clients?${params.toString()}`;
  };

  const downloadPDF = () => {
    const params = new URLSearchParams();
    if (filters.startDate) params.append('start_date', filters.startDate);
    if (filters.endDate) params.append('end_date', filters.endDate);
    
    window.open(`/reports/clients/pdf?${params.toString()}`, '_blank');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getClientType = (numeroCompras: number, totalCompras: string) => {
    const total = parseFloat(totalCompras);
    if (numeroCompras >= 10 && total >= 500) return 'VIP';
    if (numeroCompras >= 5 && total >= 200) return 'Premium';
    if (numeroCompras >= 2) return 'Regular';
    return 'Nuevo';
  };

  const getClientTypeColor = (type: string) => {
    switch (type) {
      case 'VIP': return 'bg-purple-100 text-purple-800';
      case 'Premium': return 'bg-blue-100 text-blue-800';
      case 'Regular': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const title = getTextByMode({
    niños: 'Reportes de Clientes',
    jóvenes: 'Reportes de Clientes',
    adultos: 'Reportes de Clientes'
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
              niños: 'Conoce a nuestros clientes favoritos',
              jóvenes: 'Análisis de comportamiento de clientes',
              adultos: 'Análisis detallado del comportamiento de compra de clientes'
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
                  niños: 'Total de clientes',
                  jóvenes: 'Clientes registrados',
                  adultos: 'Base de clientes'
                })}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClientes}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {getTextByMode({
                  niños: 'Clientes que compraron',
                  jóvenes: 'Clientes activos',
                  adultos: 'Clientes con compras'
                })}
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientesActivos}</div>
              <div className="text-sm text-muted-foreground">
                {totalClientes > 0 ? ((clientesActivos / totalClientes) * 100).toFixed(1) : 0}% del total
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {getTextByMode({
                  niños: 'Promedio por cliente',
                  jóvenes: 'Compra promedio',
                  adultos: 'Ticket promedio'
                })}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(parseFloat(promedioComprasPorCliente))}</div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de clientes */}
        <Card>
          <CardHeader>
            <CardTitle>
              {getTextByMode({
                niños: 'Nuestros clientes',
                jóvenes: 'Ranking de clientes',
                adultos: 'Análisis de clientes'
              })}
            </CardTitle>
            <CardDescription>
              {getTextByMode({
                niños: 'Lista de todos nuestros clientes favoritos',
                jóvenes: 'Clientes ordenados por valor total de compras',
                adultos: 'Segmentación de clientes basada en comportamiento de compra'
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clientes.map((cliente, index) => (
                <div key={cliente.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                        <div className="font-semibold">{cliente.nombre}</div>
                        <Badge className={getClientTypeColor(getClientType(cliente.numero_compras, cliente.total_compras))}>
                          {getClientType(cliente.numero_compras, cliente.total_compras)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">
                        {cliente.email}
                      </div>
                      {cliente.telefono && (
                        <div className="text-sm text-muted-foreground mb-1">
                          {cliente.telefono}
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">
                        <strong>Última compra:</strong> {formatDate(cliente.fecha_ultima_compra)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">{formatCurrency(parseFloat(cliente.total_compras))}</div>
                      <div className="text-sm text-muted-foreground">
                        {cliente.numero_compras} compras
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Promedio: {formatCurrency(parseFloat(cliente.promedio_compra))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{cliente.numero_compras}</div>
                      <div className="text-sm text-muted-foreground">
                        {getTextByMode({
                          niños: 'Compras',
                          jóvenes: 'Órdenes',
                          adultos: 'Transacciones'
                        })}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(parseFloat(cliente.promedio_compra))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {getTextByMode({
                          niños: 'Promedio',
                          jóvenes: 'Ticket promedio',
                          adultos: 'AOV'
                        })}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {formatCurrency(parseFloat(cliente.total_compras))}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {getTextByMode({
                          niños: 'Total gastado',
                          jóvenes: 'Valor total',
                          adultos: 'LTV'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {clientes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {getTextByMode({
                  niños: 'No hay clientes para mostrar',
                  jóvenes: 'No se encontraron clientes en este período',
                  adultos: 'No hay datos de clientes disponibles para el período seleccionado'
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
