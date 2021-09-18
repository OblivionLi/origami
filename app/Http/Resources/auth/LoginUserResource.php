<?php

namespace App\Http\Resources\auth;

use App\Http\Resources\role\RoleShowResource;
use Illuminate\Http\Resources\Json\JsonResource;

class LoginUserResource extends JsonResource
{
    protected $token;

    public function __construct($resource, $token)
    {
        parent::__construct($resource);
        $this->token = $token;
    }

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'message'       => 'User login success',
            'id'            => $this->id,
            'user_id'       => $this->user_id,
            'name'          => $this->name,
            'email'         => $this->email,
            'role'          => $this->roles->pluck('name'),
            'is_admin'      => $this->roles->pluck('is_admin'),
            'details'       => RoleShowResource::collection($this->roles),
            'access_token'  => $this->token,
        ];
    }
}
