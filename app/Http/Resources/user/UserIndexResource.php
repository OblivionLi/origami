<?php

namespace App\Http\Resources\user;

use Illuminate\Http\Resources\Json\JsonResource;

class UserIndexResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id'            => $this->id,
            'name'          => $this->name,
            'email'         => $this->email,
            'created_at'    => $this->created_at,
            'updated_at'    => $this->updated_at,

            'products'      => $this->products,
            'reviews'       => $this->reviews,
            'orders'        => $this->orders,
            'roles'         => $this->roles,
            'address'       => $this->addresses,
        ];
    }
}
