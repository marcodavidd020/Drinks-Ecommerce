<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Almacen extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'almacen';

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nombre',
        'descripcion',
        'ubicacion',
    ];

    /**
     * Relación con Productos a través de ProductoInventario
     */
    public function productos(): BelongsToMany
    {
        return $this->belongsToMany(Producto::class, 'producto_inventarios')
            ->withPivot('stock')
            ->withTimestamps();
    }

    /**
     * Relación con ProductoInventario
     */
    public function inventarios(): HasMany
    {
        return $this->hasMany(ProductoInventario::class);
    }

    /**
     * Relación con AjusteInventario
     */
    public function ajustesInventario(): HasMany
    {
        return $this->hasMany(AjusteInventario::class);
    }
}
