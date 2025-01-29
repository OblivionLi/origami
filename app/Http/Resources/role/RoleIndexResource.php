<?php

namespace App\Http\Resources\role;

use App\Models\Permission;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read int $id
 * @property-read string $name
 * @property-read boolean $is_admin
 * @property-read Carbon $created_at
 * @property-read Carbon $updated_at
 * @property-read Collection<Permission> $permissions
 * @property-read Collection<User> $users
 */
class RoleIndexResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param Request $request
     * @return array
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'is_admin' => $this->is_admin,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,

            'permissions' => $this->whenLoaded('permissions'),
            'users' => $this->whenLoaded('users')
        ];
    }
}
