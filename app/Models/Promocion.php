<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Promocion extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'promocion';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nombre',
        'fecha_inicio',
        'fecha_fin',
        'estado',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
    ];

    /**
     * Relación con Productos
     */
    public function productos(): BelongsToMany
    {
        return $this->belongsToMany(Producto::class, 'promocion_productos')
            ->withPivot('descuento_porcentaje', 'descuento_fijo')
            ->withTimestamps();
    }

    /**
     * Verifica si la promoción está activa
     */
    public function estaActiva(): bool
    {
        $hoy = now()->toDateString();
        return $hoy >= $this->fecha_inicio && $hoy <= $this->fecha_fin;
    }
}
