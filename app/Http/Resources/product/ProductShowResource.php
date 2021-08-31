<?php

namespace App\Http\Resources\product;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductShowResource extends JsonResource
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
            'id'                => $this->id,
            'name'              => $this->name,
            'description'       => $this->description,
            'price'             => $this->price,
            'discount'          => $this->discount,
            'special_offer'     => $this->special_offer,
            'product_code'      => $this->product_code,
            'rating'            => $this->rating,
            'total_reviews'     => $this->total_reviews,
            'total_quantities'  => $this->total_quantities,
            'created_at'        => $this->created_at,
            'updated_at'        => $this->updated_at,

            'parent_category'   => $this->parentCategory,
            'child_category'    => $this->childCategory,
            'user'              => $this->user,
            'images'            => $this->productImages,
            'reviews'           => $this->reviews
        ];
    }
}
