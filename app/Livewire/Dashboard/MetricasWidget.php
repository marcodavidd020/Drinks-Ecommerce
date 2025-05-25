<?php

declare(strict_types=1);

namespace App\Livewire\Dashboard;

use App\Models\Carrito;
use App\Models\Cliente;
use App\Models\NotaVenta;
use App\Models\Producto;
use App\Models\Pqrsona;
use App\Models\Proveedor;
use Illuminate\Support\Facades\DB;
use Livewire\Component;

class MetricasWidget extends Component
{
    public $totalVentas;
    public $totalClientes;
    public $totalProductos;
    public $totalProveedores;
    public $ventasEsteMes;
    public $clientesEsteMes;
    public $pqrsPendientes;
    public $carritosAbandonados;
    public $productosStockBajo;
    
    public function mount()
    {
        $this->actualizarMetricas();
    }

    public function actualizarMetricas()
    {
        $this->totalVentas = NotaVenta::where('estado', 'completada')->sum('total');
        $this->totalClientes = Cliente::count();
        $this->totalProductos = Producto::count();
        $this->totalProveedores = Proveedor::count();
        
        $this->ventasEsteMes = NotaVenta::where('estado', 'completada')
            ->whereMonth('fecha', now()->month)
            ->whereYear('fecha', now()->year)
            ->sum('total');
            
        $this->clientesEsteMes = Cliente::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
            
        $this->pqrsPendientes = Pqrsona::where('estado', 'pendiente')->count();
        
        $this->carritosAbandonados = Carrito::where('estado', 'activo')
            ->where('updated_at', '<', now()->subDays(7))
            ->count();
            
        $this->productosStockBajo = DB::table('producto_inventarios')
            ->select('producto_id', DB::raw('SUM(stock) as total_stock'))
            ->groupBy('producto_id')
            ->having('total_stock', '<', 10)
            ->count();
    }

    public function render()
    {
        return view('livewire.dashboard.metricas-widget');
    }
}
