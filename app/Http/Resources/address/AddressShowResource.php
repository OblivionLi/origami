<?php

namespace App\Http\Resources\address;

use Illuminate\Http\Resources\Json\JsonResource;

class AddressShowResource extends JsonResource
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
            'user_id'       => $this->user_id,
            'name'          => $this->name,
            'surname'       => $this->surname,
            'country'       => $this->country,
            'city'          => $this->city,
            'address'       => $this->address,
            'postal_code'   => $this->postal_code,
            'phone_number'  => $this->phone_number,

            'user'          => $this->user,
        ];
    }
}
