<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetalleCompra extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nota_compra_id',
        'producto_id',
        'cantidad',
        'precio',
        'total',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'precio' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    /**
     * Relación con NotaCompra
     */
    public function notaCompra(): BelongsTo
    {
        return $this->belongsTo(NotaCompra::class);
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

        static::saving(function (DetalleCompra $detalle) {
            $detalle->total = $detalle->cantidad * $detalle->precio;
        });
    }
}
