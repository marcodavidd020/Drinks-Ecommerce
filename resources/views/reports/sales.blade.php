<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Ventas</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #4f46e5;
            padding-bottom: 20px;
        }
        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #4f46e5;
            margin-bottom: 5px;
        }
        .report-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .date-range {
            font-size: 14px;
            color: #666;
        }
        .stats-grid {
            display: table;
            width: 100%;
            margin-bottom: 30px;
        }
        .stats-row {
            display: table-row;
        }
        .stats-cell {
            display: table-cell;
            width: 33.33%;
            padding: 15px;
            text-align: center;
            border: 1px solid #e5e7eb;
            background-color: #f9fafb;
        }
        .stats-value {
            font-size: 20px;
            font-weight: bold;
            color: #4f46e5;
        }
        .stats-label {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            margin: 30px 0 15px 0;
            padding: 10px;
            background-color: #f3f4f6;
            border-left: 4px solid #4f46e5;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .table th {
            background-color: #4f46e5;
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-weight: bold;
        }
        .table td {
            padding: 10px 8px;
            border-bottom: 1px solid #e5e7eb;
        }
        .table tr:nth-child(even) {
            background-color: #f9fafb;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .currency {
            font-weight: bold;
            color: #059669;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 10px;
            color: #666;
        }
        .category-table {
            margin-top: 20px;
        }
        .no-data {
            text-align: center;
            padding: 20px;
            color: #666;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">Arturo</div>
        <div class="report-title">Reporte de Ventas</div>
        <div class="date-range">
            Período: {{ \Carbon\Carbon::parse($startDate)->format('d/m/Y') }} - {{ \Carbon\Carbon::parse($endDate)->format('d/m/Y') }}
        </div>
        <div class="date-range">
            Generado el: {{ \Carbon\Carbon::now()->format('d/m/Y H:i') }}
        </div>
    </div>

    <!-- Estadísticas Generales -->
    <div class="stats-grid">
        <div class="stats-row">
            <div class="stats-cell">
                <div class="stats-value">${{ number_format($salesStats['total_sales'], 2) }}</div>
                <div class="stats-label">Total Ventas</div>
            </div>
            <div class="stats-cell">
                <div class="stats-value">{{ $salesStats['total_orders'] }}</div>
                <div class="stats-label">Total Órdenes</div>
            </div>
            <div class="stats-cell">
                <div class="stats-value">${{ number_format($salesStats['average_order_value'], 2) }}</div>
                <div class="stats-label">Promedio por Orden</div>
            </div>
        </div>
    </div>

    <!-- Ventas por Categoría -->
    @if($salesByCategory->count() > 0)
    <div class="section-title">Ventas por Categoría</div>
    <table class="table category-table">
        <thead>
            <tr>
                <th>Categoría</th>
                <th class="text-right">Total Vendido</th>
                <th class="text-right">Porcentaje</th>
            </tr>
        </thead>
        <tbody>
            @foreach($salesByCategory as $category)
            <tr>
                <td>{{ $category->categoria }}</td>
                <td class="text-right currency">${{ number_format($category->total, 2) }}</td>
                <td class="text-right">{{ number_format(($category->total / $salesStats['total_sales']) * 100, 1) }}%</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    <!-- Detalle de Ventas -->
    <div class="section-title">Detalle de Ventas</div>
    @if($sales->count() > 0)
    <table class="table">
        <thead>
            <tr>
                <th>Fecha</th>
                <th>Cliente</th>
                <th class="text-center">Productos</th>
                <th class="text-right">Total</th>
                <th class="text-center">Estado</th>
            </tr>
        </thead>
        <tbody>
            @foreach($sales as $sale)
            <tr>
                <td>{{ \Carbon\Carbon::parse($sale->fecha)->format('d/m/Y') }}</td>
                <td>{{ $sale->cliente->user->nombre ?? 'Cliente eliminado' }}</td>
                <td class="text-center">{{ $sale->detalles->count() }}</td>
                <td class="text-right currency">${{ number_format($sale->total, 2) }}</td>
                <td class="text-center">
                    <span style="
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 10px;
                        font-weight: bold;
                        background-color: {{ $sale->estado === 'completada' ? '#dcfce7' : '#fef3c7' }};
                        color: {{ $sale->estado === 'completada' ? '#166534' : '#92400e' }};
                    ">
                        {{ ucfirst($sale->estado) }}
                    </span>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @else
    <div class="no-data">No se encontraron ventas en el período seleccionado.</div>
    @endif

    <div class="footer">
        <p>Arturo - Sistema de Gestión de Bebidas | Página {{ $loop->iteration ?? 1 }}</p>
        <p>Este reporte contiene información confidencial de la empresa.</p>
    </div>
</body>
</html> 