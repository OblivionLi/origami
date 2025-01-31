<?php

namespace App\Http\Resources\address;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @property-read int $id
 * @property-read int $user_id
 * @property-read string $name
 * @property-read string $surname
 * @property-read string $country
 * @property-read string $city
 * @property-read string $address
 * @property-read string $postal_code
 * @property-read string $phone_number
 * @property-read Collection<User> $user
 */
class AddressShowResource extends JsonResource
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
            'user_id' => $this->user_id,
            'name' => $this->name,
            'surname' => $this->surname,
            'country' => $this->country,
            'city' => $this->city,
            'address' => $this->address,
            'postal_code' => $this->postal_code,
            'phone_number' => $this->phone_number,

            'user' => $this->whenLoaded('user'),
        ];
    }
}
