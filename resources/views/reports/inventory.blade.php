<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Inventario</title>
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
            border-bottom: 2px solid #059669;
            padding-bottom: 20px;
        }
        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #059669;
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
            background-color: #f0fdf4;
        }
        .stats-value {
            font-size: 20px;
            font-weight: bold;
            color: #059669;
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
            background-color: #f0fdf4;
            border-left: 4px solid #059669;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .table th {
            background-color: #059669;
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
        .low-stock {
            background-color: #fef2f2 !important;
            color: #dc2626;
        }
        .good-stock {
            background-color: #f0fdf4;
            color: #059669;
        }
        .stock-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
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
        <div class="report-title">Reporte de Inventario</div>
        <div class="date-range">
            Umbral de Stock Bajo: {{ $lowStockThreshold }} unidades
        </div>
        <div class="date-range">
            Generado el: {{ \Carbon\Carbon::now()->format('d/m/Y H:i') }}
        </div>
    </div>

    <!-- Estadísticas Generales -->
    <div class="stats-grid">
        <div class="stats-row">
            <div class="stats-cell">
                <div class="stats-value">{{ number_format($inventoryStats['total_products']) }}</div>
                <div class="stats-label">Total Productos</div>
            </div>
            <div class="stats-cell">
                <div class="stats-value">${{ number_format($inventoryStats['total_value'], 2) }}</div>
                <div class="stats-label">Valor Total</div>
            </div>
            <div class="stats-cell">
                <div class="stats-value">{{ $inventoryStats['low_stock_count'] }}</div>
                <div class="stats-label">Productos Bajo Stock</div>
            </div>
        </div>
    </div>

    <!-- Stock por Categoría -->
    @if($stockByCategory->count() > 0)
    <div class="section-title">Stock por Categoría</div>
    <table class="table">
        <thead>
            <tr>
                <th>Categoría</th>
                <th class="text-right">Stock Total</th>
                <th class="text-right">Porcentaje</th>
            </tr>
        </thead>
        <tbody>
            @foreach($stockByCategory as $category)
            <tr>
                <td>{{ $category->categoria }}</td>
                <td class="text-right">{{ number_format($category->stock) }} unidades</td>
                <td class="text-right">{{ number_format(($category->stock / $inventoryStats['total_products']) * 100, 1) }}%</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    <!-- Productos con Stock Bajo -->
    @if($lowStockProducts->count() > 0)
    <div class="section-title">⚠️ Productos con Stock Bajo (≤ {{ $lowStockThreshold }} unidades)</div>
    <table class="table">
        <thead>
            <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Almacén</th>
                <th class="text-right">Stock Actual</th>
                <th class="text-right">Precio</th>
                <th class="text-right">Valor Stock</th>
            </tr>
        </thead>
        <tbody>
            @foreach($lowStockProducts as $item)
            <tr class="low-stock">
                <td>{{ $item->producto->nombre ?? 'N/A' }}</td>
                <td>{{ $item->producto->categoria->nombre ?? 'N/A' }}</td>
                <td>{{ $item->almacen->nombre ?? 'N/A' }}</td>
                <td class="text-right">
                    <span class="stock-badge" style="background-color: #fecaca; color: #dc2626;">
                        {{ $item->stock }}
                    </span>
                </td>
                <td class="text-right currency">${{ number_format($item->precio_venta, 2) }}</td>
                <td class="text-right currency">${{ number_format($item->stock * $item->precio_venta, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @else
    <div class="section-title">✅ Productos con Stock Bajo</div>
    <div class="no-data">No hay productos con stock bajo en este momento.</div>
    @endif

    <!-- Inventario Completo -->
    <div class="section-title">Inventario Completo</div>
    @if($inventory->count() > 0)
    <table class="table">
        <thead>
            <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Almacén</th>
                <th class="text-right">Stock</th>
                <th class="text-right">Precio</th>
                <th class="text-right">Valor Total</th>
                <th class="text-center">Estado</th>
            </tr>
        </thead>
        <tbody>
            @foreach($inventory as $item)
            <tr class="{{ $item->stock <= $lowStockThreshold ? 'low-stock' : '' }}">
                <td>{{ $item->producto->nombre ?? 'N/A' }}</td>
                <td>{{ $item->producto->categoria->nombre ?? 'N/A' }}</td>
                <td>{{ $item->almacen->nombre ?? 'N/A' }}</td>
                <td class="text-right">{{ $item->stock }}</td>
                <td class="text-right currency">${{ number_format($item->precio_venta, 2) }}</td>
                <td class="text-right currency">${{ number_format($item->stock * $item->precio_venta, 2) }}</td>
                <td class="text-center">
                    @if($item->stock <= $lowStockThreshold)
                        <span class="stock-badge" style="background-color: #fecaca; color: #dc2626;">
                            Bajo Stock
                        </span>
                    @elseif($item->stock <= 50)
                        <span class="stock-badge" style="background-color: #fef3c7; color: #92400e;">
                            Stock Medio
                        </span>
                    @else
                        <span class="stock-badge" style="background-color: #dcfce7; color: #166534;">
                            Stock Bueno
                        </span>
                    @endif
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @else
    <div class="no-data">No se encontraron productos en el inventario.</div>
    @endif

    <div class="footer">
        <p>Arturo - Sistema de Gestión de Bebidas | Reporte de Inventario</p>
        <p>Este reporte contiene información confidencial de la empresa.</p>
    </div>
</body>
</html> 