<?php

namespace App\Http\Resources\auth;

use App\Models\Role;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read int $id
 * @property-read string $name
 * @property-read string $email
 * @property-read Collection<Role> $roles
 */
class RegisterUserResource extends JsonResource
{
    /**
     * @var string
     */
    protected string $token;

    public function __construct($resource, $token)
    {
        parent::__construct($resource);
        $this->token = $token;
    }

    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray(Request $request): array
    {
        return [
            'message' => 'User register with success.',
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->whenLoaded('roles', function () {
                return $this->roles->pluck('name');
            }),
            'is_admin' => $this->whenLoaded('roles', function () {
                return $this->roles->pluck('is_admin');
            }),
            'access_token' => $this->token
        ];
    }
}
