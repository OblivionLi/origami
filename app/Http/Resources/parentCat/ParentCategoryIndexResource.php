<?php

namespace App\Http\Resources\parentCat;

use Illuminate\Http\Resources\Json\JsonResource;

class ParentCategoryIndexResource extends JsonResource
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
            'id'            => $this->id,
            'name'          => $this->name,
            'created_at'    => $this->created_at,
            'updated_at'    => $this->updated_at,

            'products'      => $this->products,
            'childCat'      => $this->childCategories->pluck('name')
        ];
    }
}
