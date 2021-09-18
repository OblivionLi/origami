<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Order extends Model
{
    use HasFactory;

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
        return $query->with(['user', 'products', 'user.addresses']);
    }

    // dashboard charts scope func()
    // count all orders by month
    public function scopeOrderCount()
    {
        $orders = Order::select('id', 'created_at')->where('is_paid', 1)->get()->groupBy(function ($date) {
            return Carbon::parse($date->created_at)->format('m');
        });

        $orderCount = [];
        $orderArr = [];

        foreach ($orders as $key => $value) {
            $orderCount[(int)$key] = count($value);
        }

        for ($i = 1; $i <= 12; $i++) {
            if (!empty($orderCount[$i])) {
                $orderArr[] = $orderCount[$i];
            } else {
                $orderArr[] = 0;
            }
        }

        return $orderArr;
    }

    // get revenue from last month
    public function scopeRevenueLastMonth()
    {
        $revenueLastMonth = DB::table('orders')
            ->select(
                DB::raw('MONTHNAME(created_at) as month'),
                DB::raw('SUM(total_price) as sum')
            )
            ->groupBy('month')
            ->get();

        return $revenueLastMonth;
    }

    // get revenue all time
    public function scopeRevenueAllTime()
    {
        $revenueAllTime = DB::table('orders')
            ->select(
                DB::raw('SUM(total_price) as sum')
            )
            ->get();

        return $revenueAllTime;
    }

    // get average order total_price
    public function scopeAverageRevenue()
    {
        $averageRevenue = DB::table('orders')
            ->select(
                DB::raw('AVG(total_price) as sum')
            )
            ->get();

        return $averageRevenue;
    }
}
