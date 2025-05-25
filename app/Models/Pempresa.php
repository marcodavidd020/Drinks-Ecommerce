<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Pempresa extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'razon_social',
        'nit',
        'telefono',
        'direccion',
        'email',
        'representante_legal',
    ];

    /**
     * Relación polimórfica con Proveedor
     */
    public function proveedor(): MorphOne
    {
        return $this->morphOne(Proveedor::class, 'proveedorable');
    }

    /**
     * Obtener nombre para mostrar
     */
    public function getNombreDisplayAttribute(): string
    {
        return $this->razon_social;
    }
}
