<?php

namespace App\Http\Resources\order;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderShowResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id'                        => $this->id,
            'user_id'                   => $this->user_id,
            'status'                    => $this->status,
            'products_price'            => $this->products_price,
            'products_discount_price'   => $this->products_discount_price,
            'shipping_price'            => $this->shipping_price,
            'tax_price'                 => $this->tax_price,
            'total_price'               => $this->total_price,
            'is_paid'                   => $this->is_paid,
            'is_delivered'              => $this->is_delivered,
            'delivered_at'              => $this->delivered_at,
            'paid_at'                   => $this->paid_at,
            'created_at'                => $this->created_at,
            'updated_at'                => $this->updated_at,

            'products'                  => $this->products,
            'user'                      => $this->user
        ];
    }
}
