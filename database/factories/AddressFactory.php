<?php

namespace Database\Factories;

use App\Models\Address;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Address>
 */
class AddressFactory extends Factory
{
    protected $model = Address::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->firstName,
            'surname' => $this->faker->lastName,
            'country' => $this->faker->country,
            'city' => $this->faker->city,
            'address' => $this->faker->streetAddress,
            'postal_code' => $this->faker->postcode,
            'phone_number' => $this->faker->phoneNumber,
        ];
    }
}
