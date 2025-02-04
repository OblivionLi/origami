<?php

namespace App\Http\Resources\user;

use App\Models\Address;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\Role;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read int $id
 * @property-read int $user_id
 * @property-read string $name
 * @property-read string $email
 * @property-read Carbon $created_at
 * @property-read Carbon $updated_at
 * @property-read Collection<Product> $products
 * @property-read Collection<Review> $reviews
 * @property-read Collection<Order> $orders
 * @property-read Collection<Role> $roles
 * @property-read Collection<Address> $addresses
 */
class UserIndexResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            'products' => $this->whenLoaded('products'),
            'reviews' => $this->whenLoaded('reviews'),
            'orders' => $this->whenLoaded('orders'),
            'roles' => $this->whenLoaded('roles'),
            'address' => $this->whenLoaded('addresses'),
        ];
    }
}
