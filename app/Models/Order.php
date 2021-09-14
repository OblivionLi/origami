<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
       'id', 
       'user_id',
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

    // define scope function that return a query with eager loading
    public function scopeInfo($query)
    {
        // return data from relationships
        return $query->with(['user', 'products']);
    }
}
