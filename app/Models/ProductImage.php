<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property-read string $name
 * @property-read string $path
 * @property-read int $product_id
 */
class ProductImage extends Model
{
    use HasFactory;

    /**
     * @var array[int, string]
     */
    protected $fillable = [
        'name', 'path', 'product_id'
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
