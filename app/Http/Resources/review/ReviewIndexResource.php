<?php

namespace App\Http\Resources\review;

use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read int $id
 * @property-read string $user_name
 * @property-read string $user_comment
 * @property-read string $admin_name
 * @property-read string $admin_comment
 * @property-read Carbon $created_at
 * @property-read Carbon $updated_at
 * @property-read Collection<Product> $product
 * @property-read Collection<User> $user
 */
class ReviewIndexResource extends JsonResource
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
            'user_name' => $this->user_name,
            'user_comment' => $this->user_comment,
            'admin_name' => $this->admin_name,
            'admin_comment' => $this->admin_comment,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            'product' => $this->whenLoaded('product'),
            'user' => $this->whenLoaded('user'),
        ];
    }
}
