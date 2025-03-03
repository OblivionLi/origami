<?php

namespace App\Http\Resources\childCat;

use App\Models\ParentCategory;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read int $id
 * @property-read string $name
 * @property-read string $slug
 * @property-read int $quantity
 * @property-read Carbon $created_at
 * @property-read Carbon $updated_at
 * @property-read Collection<Product> $products
 * @property-read ParentCategory $parentCategory
 */
class ChildCategoryIndexResource extends JsonResource
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
            'quantity' => $this->quantity,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'products' => $this->whenLoaded('products'),
            'parentCategory' => $this->whenLoaded('parentCategory'),
        ];
    }
}
