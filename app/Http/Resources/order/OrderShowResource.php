<?php

namespace App\Http\Resources\order;

use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read int $id
 * @property-read int $user_id
 * @property-read int $order_id
 * @property-read int $address_id
 * @property-read string $status
 * @property-read Carbon $paid_at
 * @property-read boolean $is_delivered
 * @property-read boolean $is_paid
 * @property-read double $products_price
 * @property-read double $products_discount_price
 * @property-read double $shipping_price
 * @property-read double $tax_price
 * @property-read double $total_price
 * @property-read Carbon $delivered_at
 * @property-read Carbon $created_at
 * @property-read Carbon $updated_at
 * @property-read Collection<Product> $products
 * @property-read Collection<User> $user
 */
class OrderShowResource extends JsonResource
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
            'id' => $this->id,
            'user_id' => $this->user_id,
            'address_id' => $this->address_id,
            'order_id' => $this->order_id,
            'status' => $this->status,
            'products_price' => $this->products_price,
            'products_discount_price' => $this->products_discount_price,
            'shipping_price' => $this->shipping_price,
            'tax_price' => $this->tax_price,
            'total_price' => $this->total_price,
            'is_paid' => $this->is_paid,
            'is_delivered' => $this->is_delivered,
            'delivered_at' => $this->delivered_at,
            'paid_at' => $this->paid_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            'products' => $this->whenLoaded('products'),
            'user' => $this->whenLoaded('user'),
        ];
    }
}
