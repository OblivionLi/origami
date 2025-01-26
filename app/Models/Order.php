<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Order extends Model
{
    use HasFactory;

    /**
     * @var array[int, string]
     */
    protected $fillable = [
        'id',
        'user_id',
        'order_id',
        'status',
        'products_price',
        'products_discount_price',
        'shipping_price',
        'tax_price',
        'total_price',
        'is_paid',
        'is_delivered',
        'paid_at',
        'delivered_at'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'order_product')->withPivot('qty');
    }
}
