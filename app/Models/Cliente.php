<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Cliente extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'cliente';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'nit',
        'telefono',
        'fecha_nacimiento',
        'genero',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'fecha_nacimiento' => 'date',
    ];

    /**
     * Relación con User
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación con Dirección
     */
    public function direccion(): HasOne
    {
        return $this->hasOne(Direccion::class);
    }

    /**
     * Relación con Carrito
     */
    public function carritos(): HasMany
    {
        return $this->hasMany(Carrito::class);
    }

    /**
     * Relación con NotasVenta
     */
    public function notasVenta(): HasMany
    {
        return $this->hasMany(NotaVenta::class);
    }

    /**
     * Obtener carrito activo del cliente
     */
    public function carritoActivo(): ?Carrito
    {
        return $this->carritos()->where('estado', 'activo')->first();
    }
}
