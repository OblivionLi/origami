<?php

namespace Database\Factories;

use App\Models\ParentCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class ParentCategoryFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ParentCategory::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->word,
        ];
    }
}
