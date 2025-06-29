<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetalleVenta extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'detalle_venta';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nota_venta_id',
        'producto_almacen_id',
        'cantidad',
        'total',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'total' => 'decimal:2',
    ];

    /**
     * Relación con NotaVenta
     */
    public function notaVenta(): BelongsTo
    {
        return $this->belongsTo(NotaVenta::class);
    }

    /**
     * Relación con ProductoAlmacen
     */
    public function productoAlmacen(): BelongsTo
    {
        return $this->belongsTo(ProductoAlmacen::class);
    }

    /**
     * Acceso al producto a través de ProductoAlmacen
     */
    public function getProductoAttribute()
    {
        return $this->productoAlmacen->producto ?? null;
    }
}
