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
        'producto_id',
        'cantidad',
        'precio_unitario',
        'total',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'precio_unitario' => 'decimal:2',
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
     * Relación con Producto
     */
    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class);
    }

    /**
     * Calcular el total automáticamente
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function (DetalleVenta $detalle) {
            $detalle->total = $detalle->cantidad * $detalle->precio_unitario;
        });
    }
}
