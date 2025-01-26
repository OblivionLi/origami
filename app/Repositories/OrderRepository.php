<?php

namespace App\Repositories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Builder;

class OrderRepository
{
    public function getOrderWithRelations(): Builder
    {
        return Order::with(['user', 'products', 'user.addresses']);
    }

    public function getPaidOrderCountsByMonth(): array
    {
         $orderCounts = Order::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
            ->where('is_paid', 1)
            ->groupBy('month')
            ->pluck('count', 'month');

        $monthlyCounts = [];

        for ($i = 1; $i <= 12; $i++) {
            $monthlyCounts[] = $orderCounts[$i] ?? 0;
        }

        return $monthlyCounts;
    }

    public function getOrderRevenuesForLastMonth(): array
    {
        return Order::selectRaw('MONTH(created_at) as month, SUM(total_price) as sum')
            ->groupBy('month')
            ->get();
    }

    public function getTotalOrderRevenues(): array
    {
        return Order::selectRaw('SUM(total_price) as sum')
            ->get();
    }

    public function getTotalOrderRevenuesAvg() : array
    {
        return Order::selectRaw('AVG(total_price) as avg')
            ->get();
    }
}
