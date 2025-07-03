<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte de Clientes</title>
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
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 20px;
        }
        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #3b82f6;
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
            background-color: #eff6ff;
        }
        .stats-value {
            font-size: 20px;
            font-weight: bold;
            color: #3b82f6;
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
            background-color: #eff6ff;
            border-left: 4px solid #3b82f6;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .table th {
            background-color: #3b82f6;
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
        .client-active {
            background-color: #f0fdf4;
            color: #166534;
        }
        .client-inactive {
            background-color: #fef2f2;
            color: #dc2626;
        }
        .client-badge {
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
        .top-client {
            background-color: #fef3c7;
            color: #92400e;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">Arturo</div>
        <div class="report-title">Reporte de Clientes</div>
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
                <div class="stats-value">{{ $clientStats['total_clients'] }}</div>
                <div class="stats-label">Total Clientes</div>
            </div>
            <div class="stats-cell">
                <div class="stats-value">{{ $clientStats['active_clients'] }}</div>
                <div class="stats-label">Clientes Activos</div>
            </div>
            <div class="stats-cell">
                <div class="stats-value">{{ $clientStats['new_clients'] }}</div>
                <div class="stats-label">Nuevos Clientes</div>
            </div>
        </div>
    </div>

    <!-- Top Clientes -->
    @if($clients->where('total_gastado', '>', 0)->count() > 0)
    <div class="section-title">🏆 Top 10 Clientes por Ventas</div>
    <table class="table">
        <thead>
            <tr>
                <th>Posición</th>
                <th>Cliente</th>
                <th>Email</th>
                <th class="text-center">Total Compras</th>
                <th class="text-right">Total Gastado</th>
                <th class="text-right">Promedio por Compra</th>
                <th class="text-center">Estado</th>
            </tr>
        </thead>
        <tbody>
            @foreach($clients->where('total_gastado', '>', 0)->take(10) as $index => $client)
            <tr class="{{ $index < 3 ? 'top-client' : '' }}">
                <td class="text-center">
                    @if($index === 0) 🥇
                    @elseif($index === 1) 🥈
                    @elseif($index === 2) 🥉
                    @else {{ $index + 1 }}
                    @endif
                </td>
                <td>{{ $client->user->nombre ?? 'N/A' }}</td>
                <td>{{ $client->user->email ?? 'N/A' }}</td>
                <td class="text-center">{{ $client->total_compras ?? 0 }}</td>
                <td class="text-right currency">${{ number_format($client->total_gastado ?? 0, 2) }}</td>
                <td class="text-right currency">
                    ${{ number_format($client->total_compras > 0 ? ($client->total_gastado / $client->total_compras) : 0, 2) }}
                </td>
                <td class="text-center">
                    <span class="client-badge {{ $client->user->estado === 'activo' ? 'client-active' : 'client-inactive' }}"
                          style="background-color: {{ $client->user->estado === 'activo' ? '#dcfce7' : '#fecaca' }};
                                 color: {{ $client->user->estado === 'activo' ? '#166534' : '#dc2626' }};">
                        {{ ucfirst($client->user->estado ?? 'N/A') }}
                    </span>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    <!-- Clientes sin Compras -->
    @if($clients->where('total_gastado', '=', 0)->count() > 0)
    <div class="section-title">⚠️ Clientes sin Compras en el Período</div>
    <table class="table">
        <thead>
            <tr>
                <th>Cliente</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th class="text-center">Fecha Registro</th>
                <th class="text-center">Estado</th>
            </tr>
        </thead>
        <tbody>
            @foreach($clients->where('total_gastado', '=', 0)->take(20) as $client)
            <tr>
                <td>{{ $client->user->nombre ?? 'N/A' }}</td>
                <td>{{ $client->user->email ?? 'N/A' }}</td>
                <td>{{ $client->user->celular ?? 'No registrado' }}</td>
                <td class="text-center">{{ \Carbon\Carbon::parse($client->created_at)->format('d/m/Y') }}</td>
                <td class="text-center">
                    <span class="client-badge {{ $client->user->estado === 'activo' ? 'client-active' : 'client-inactive' }}"
                          style="background-color: {{ $client->user->estado === 'activo' ? '#dcfce7' : '#fecaca' }};
                                 color: {{ $client->user->estado === 'activo' ? '#166534' : '#dc2626' }};">
                        {{ ucfirst($client->user->estado ?? 'N/A') }}
                    </span>
                </td>
            </tr>
            @endforeach
            @if($clients->where('total_gastado', '=', 0)->count() > 20)
            <tr>
                <td colspan="5" class="text-center" style="font-style: italic; color: #666;">
                    ... y {{ $clients->where('total_gastado', '=', 0)->count() - 20 }} clientes más sin compras
                </td>
            </tr>
            @endif
        </tbody>
    </table>
    @endif

    <!-- Listado Completo de Clientes -->
    <div class="section-title">📋 Listado Completo de Clientes</div>
    @if($clients->count() > 0)
    <table class="table">
        <thead>
            <tr>
                <th>Cliente</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th class="text-center">Total Compras</th>
                <th class="text-right">Total Gastado</th>
                <th class="text-center">Registro</th>
                <th class="text-center">Estado</th>
            </tr>
        </thead>
        <tbody>
            @foreach($clients as $client)
            <tr>
                <td>{{ $client->user->nombre ?? 'N/A' }}</td>
                <td>{{ $client->user->email ?? 'N/A' }}</td>
                <td>{{ $client->user->celular ?? 'No registrado' }}</td>
                <td class="text-center">{{ $client->total_compras ?? 0 }}</td>
                <td class="text-right currency">${{ number_format($client->total_gastado ?? 0, 2) }}</td>
                <td class="text-center">{{ \Carbon\Carbon::parse($client->created_at)->format('d/m/Y') }}</td>
                <td class="text-center">
                    <span class="client-badge {{ $client->user->estado === 'activo' ? 'client-active' : 'client-inactive' }}"
                          style="background-color: {{ $client->user->estado === 'activo' ? '#dcfce7' : '#fecaca' }};
                                 color: {{ $client->user->estado === 'activo' ? '#166534' : '#dc2626' }};">
                        {{ ucfirst($client->user->estado ?? 'N/A') }}
                    </span>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @else
    <div class="no-data">No se encontraron clientes registrados.</div>
    @endif

    <div class="footer">
        <p>Arturo - Sistema de Gestión de Bebidas | Reporte de Clientes</p>
        <p>Este reporte contiene información confidencial de la empresa.</p>
    </div>
</body>
</html> 