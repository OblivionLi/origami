<?php

namespace Database\Factories;

use App\Models\Order;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class OrderFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Order::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'order_id' => Str::random(10),
            'status' => $this->faker->randomElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
            'products_price' => $this->faker->randomFloat(2, 10, 200),
            'products_discount_price' => $this->faker->randomFloat(2, 0, 50),
            'shipping_price' => $this->faker->randomFloat(2, 5, 20),
            'tax_price' => $this->faker->randomFloat(2, 1, 10),
            'total_price' => $this->faker->randomFloat(2, 20, 300),
            'is_paid' => $this->faker->boolean,
            'is_delivered' => $this->faker->boolean,
            'paid_at' => $this->faker->optional()->dateTimeThisYear,
            'delivered_at' => $this->faker->optional()->dateTimeThisYear,
        ];
    }
}
