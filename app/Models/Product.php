<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;

class Product extends Model
{
    use HasFactory, Sluggable;

    protected $fillable = [
        'name', 'description', 'price', 'discount', 'special_offer', 'product_code', 'rating', 'total_reviews', 'total_quantities'
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
     * Get the parent category that owns the product
     */
    public function parentCategory()
    {
        return $this->belongsTo(ParentCategory::class, 'parent_category_id');
    }

    /**
     * Get the child category that owns the product
     */
    public function childCategory()
    {
        return $this->belongsTo(ChildCategory::class, 'child_category_id');
    }

    /**
     * Get the user that owns the product
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the product images for the product
     */
    public function productImages()
    {
        return $this->hasMany(ProductImage::class);
    }

    /**
     * Get the reviews for the product
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
