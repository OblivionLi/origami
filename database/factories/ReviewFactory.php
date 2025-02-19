<?php

namespace Database\Factories;

use App\Models\Review;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReviewFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Review::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'rating' => $this->faker->numberBetween(1, 5),
            'user_name' => $this->faker->name,
            'user_comment' => $this->faker->paragraph,
            'admin_name' => $this->faker->optional(0.5)->name,  // 50% chance of admin review
            'admin_comment' => $this->faker->optional(0.5)->paragraph,
        ];
    }
}
