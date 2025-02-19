<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $name = $this->faker->sentence(3);

        return [
            'name' => $name,
            'description' => $this->faker->paragraph,
            'price' => $this->faker->randomFloat(2, 10, 200),
            'discount' => $this->faker->optional(0.3, 0)->randomFloat(2, 0, 50), // 30% chance of discount
            'special_offer' => $this->faker->boolean(20), // 20% chance of special offer
            'product_code' => Str::random(10),
            'total_quantities' => $this->faker->numberBetween(10, 100),
            'rating' => $this->faker->numberBetween(1, 5),
            'total_reviews' => $this->faker->numberBetween(0, 50)
        ];
    }
}
