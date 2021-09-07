<?php

namespace App\Http\Resources\auth;

use Illuminate\Http\Resources\Json\JsonResource;

class UserUpdateResource extends JsonResource
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
            'message'   => 'User update success',
            'id'        => $this->id,
            'name'      => $this->name,
            'email'     => $this->email,
            'role'      => $this->roles->pluck('name')
        ];
    }
}
