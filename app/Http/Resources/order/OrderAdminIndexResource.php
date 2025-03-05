<?php

namespace App\Http\Resources\order;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read int $id
 * @property-read int $user_id
 * @property-read int $address_id
 * @property-read string $order_id
 * @property-read string $status
 * @property-read float $total_price
 * @property-read bool $is_paid
 * @property-read bool $is_delivered
 * @property-read string|null $paid_at
 * @property-read string|null $delivered_at
 * @property-read string $created_at
 * @property-read string $updated_at
 * @property-read User $user
 * @property-read Collection|Address[] $user_addresses
 * @property-read int $products_count
 */
class OrderAdminIndexResource extends JsonResource
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
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'address' => $this->user->addresses->first()?->toArray() ?? null,
            ],
            'order_id' => $this->order_id,
            'status' => $this->status,
            'total_price' => $this->total_price,
            'is_paid' => $this->is_paid,
            'is_delivered' => $this->is_delivered,
            'paid_at' => $this->paid_at,
            'delivered_at' => $this->delivered_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'products_count' => $this->products_count,
        ];
    }
}
