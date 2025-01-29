<?php

namespace App\Http\Resources\product;

use App\Models\ChildCategory;
use App\Models\ParentCategory;
use App\Models\ProductImage;
use App\Models\Review;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read int $id
 * @property-read string $name
 * @property-read string $slug
 * @property-read string $description
 * @property-read double $price
 * @property-read int $discount
 * @property-read boolean $special_offer
 * @property-read string $product_code
 * @property-read double $rating
 * @property-read int $total_reviews
 * @property-read int $total_quantities
 * @property-read Carbon $created_at
 * @property-read Carbon $updated_at
 * @property-read Collection<ParentCategory> $parentCategory
 * @property-read Collection<ChildCategory> $childCategory
 * @property-read Collection<User> $user
 * @property-read Collection<ProductImage> $productImages
 * @property-read Collection<Review> $reviews
 */
class ProductIndexResource extends JsonResource
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
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => $this->price,
            'discount' => $this->discount != null ? $this->discount : 0,
            'special_offer' => $this->special_offer,
            'product_code' => $this->product_code,
            'rating' => $this->rating,
            'total_reviews' => $this->total_reviews,
            'total_quantities' => $this->total_quantities,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            'parent_category' => $this->whenLoaded('parentCategory', function () {
                return $this->parentCategory->pluck('name')->toArray();
            }),
            'child_category' => $this->whenLoaded('childCategory', function () {
                return $this->childCategory->pluck('name')->toArray();
            }),
            'user' => $this->whenLoaded('user', function () {
                return $this->user->pluck('name')->toArray();
            }),
            'images' => $this->whenLoaded('productImages'),
            'reviews' => $this->whenLoaded('reviews'),
        ];
    }
}
