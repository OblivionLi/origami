<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Illuminate\Support\Str;

class Order extends Model
{
    use HasFactory, Sluggable;

    protected $fillable = [
       'id', 'status', 'product_price', 'product_discount_price', 'shipping_price', 'tax_price', 'total_price', 'is_paid', 'is_delivered', 'paid_at', 'delivered_at'
    ];

    /**
     * Return the sluggable configuration array for this model.
     *
     * @return array
     */
    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'id' + Str::random(30)
            ]
        ];
    }

    /**
     * Get the user that owns the order
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * The products that belong to the order.
     */
    public function products()
    {
        return $this->belongsToMany(Product::class, 'order_product')->withPivot('qty');
    }
}
