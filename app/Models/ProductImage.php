<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'path', 'product_id'
    ];

    /**
     * Get the product that owns the product image
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
