<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetalleCarrito extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'detalle_carrito';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'carrito_id',
        'producto_almacen_id',
        'cantidad',
        'precio_unitario',
        'subtotal',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'precio_unitario' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    /**
     * Relación con Carrito
     */
    public function carrito(): BelongsTo
    {
        return $this->belongsTo(Carrito::class);
    }

    /**
     * Relación con ProductoAlmacen
     */
    public function productoAlmacen(): BelongsTo
    {
        return $this->belongsTo(ProductoAlmacen::class, 'producto_almacen_id');
    }

    /**
     * Relación con Producto a través de ProductoAlmacen
     */
    public function producto(): BelongsTo
    {
        return $this->belongsTo(Producto::class, 'producto_almacen_id', 'id')
                   ->join('producto_almacen', 'producto.id', '=', 'producto_almacen.producto_id')
                   ->where('producto_almacen.id', $this->producto_almacen_id);
    }

    /**
     * Calcular el subtotal automáticamente
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function (DetalleCarrito $detalle) {
            $detalle->subtotal = $detalle->cantidad * $detalle->precio_unitario;
        });
    }
}
