<?php

namespace App\Http\Resources\permission;

use Illuminate\Http\Resources\Json\JsonResource;

class PermissionShowResource extends JsonResource
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
            'name'          => $this->name,
            'created_at'    => $this->created_at,
            'updated_at'    => $this->updated_at,

            'roles'   => $this->roles->pluck('name')
        ];
    }
}
