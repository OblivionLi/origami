<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;

class ParentCategory extends Model
{
    use HasFactory, Sluggable;

    protected $fillable = [
        'name'
    ];

    /**
     * Return the sluggable configuration array for this model.
     *
     * @return array
     */
    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'name'
            ]
        ];
    }

    /**
     * Get the child categories for the parent category
     */
    public function childCategories()
    {
        return $this->hasMany(ChildCategory::class);
    }

    /**
     * Get the products for the parent category
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
