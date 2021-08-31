<?php

namespace App\Http\Resources\childCat;

use Illuminate\Http\Resources\Json\JsonResource;

class ChildCategoryShowResource extends JsonResource
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
            'quantity'      => $this->quantity,
            'created_at'    => $this->created_at,
            'updated_at'    => $this->updated_at,

            'products'      => $this->products,
            'parentCat'      => $this->parentCategory
        ];
    }
}
