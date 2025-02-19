<?php

namespace Database\Factories;

use App\Models\ChildCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class ChildCategoryFactory extends Factory
{

    protected $model = ChildCategory::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word, // This will be overridden in the seeder
            'quantity' => $this->faker->numberBetween(1, 100),
        ];
    }
}
