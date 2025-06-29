<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Producto extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'producto';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'cod_producto',
        'nombre',
        'precio_compra',
        'precio_venta',
        'imagen',
        'descripcion',
        'categoria_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'precio_compra' => 'decimal:2',
        'precio_venta' => 'decimal:2',
    ];

    /**
     * Relación con Categoria
     */
    public function categoria(): BelongsTo
    {
        return $this->belongsTo(Categoria::class);
    }

    /**
     * Relación con Almacenes a través de la tabla pivote producto_almacen
     */
    public function almacenes(): BelongsToMany
    {
        return $this->belongsToMany(Almacen::class, 'producto_almacen')
            ->withPivot('stock')
            ->withTimestamps();
    }

    /**
     * Relación con el modelo de la tabla pivote ProductoAlmacen
     */
    public function productoAlmacenes(): HasMany
    {
        return $this->hasMany(ProductoAlmacen::class);
    }

    /**
     * Relación con Promociones
     */
    public function promociones(): BelongsToMany
    {
        return $this->belongsToMany(Promocion::class, 'promocion_productos')
            ->withPivot('descuento_porcentaje', 'descuento_fijo')
            ->withTimestamps();
    }

    /**
     * Relación con DetalleCarrito
     */
    public function detallesCarrito(): HasMany
    {
        return $this->hasMany(DetalleCarrito::class);
    }

    /**
     * Relación con DetalleVenta
     */
    public function detallesVenta(): HasMany
    {
        return $this->hasMany(DetalleVenta::class);
    }

    /**
     * Relación con DetalleCompra
     */
    public function detallesCompra(): HasMany
    {
        return $this->hasMany(DetalleCompra::class);
    }

    /**
     * Relación con DetalleAjuste
     */
    public function detallesAjuste(): HasMany
    {
        return $this->hasMany(DetalleAjuste::class);
    }

    /**
     * Obtener el stock total del producto en todos los almacenes
     */
    public function getStockTotalAttribute(): int
    {
        return $this->productoAlmacenes()->sum('stock');
    }

    /**
     * Obtener el stock en un almacén específico
     */
    public function getStockEnAlmacen(int $almacenId): int
    {
        $inventario = $this->productoAlmacenes()->where('almacen_id', $almacenId)->first();
        return $inventario ? (int) $inventario->stock : 0;
    }
}
