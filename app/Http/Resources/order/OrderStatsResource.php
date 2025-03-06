<?php

namespace App\Http\Resources\order;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderStatsResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray(Request $request): array
    {
        return [
            'orderCount' => (int) $this['orderCount'],
            'userCount' => (int) $this['userCount'],
            'revenueLastMonth' => (float) $this['revenueLastMonth'],
            'revenueLastMonthName' => $this['revenueLastMonthName'],
            'revenueAllTime' => (float) $this['revenueAllTime'],
            'averageRevenue' => (float) $this['averageRevenue'],
            'timestamp' => now()->toIso8601String(),
        ];
    }
}
