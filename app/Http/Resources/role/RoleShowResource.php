<?php

namespace App\Http\Resources\role;

use Illuminate\Http\Resources\Json\JsonResource;

class RoleShowResource extends JsonResource
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
            'is_admin'      => $this->is_admin,
            'created_at'    => $this->created_at,
            'updated_at'    => $this->updated_at,

            'permissions'   => $this->permissions,
            'users'         => $this->users
        ];
    }
}
