<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Cviebrock\EloquentSluggable\SluggableScopeHelpers;

class Product extends Model
{
    use HasFactory, Sluggable, SluggableScopeHelpers;

    protected $fillable = [
        'name', 'user_id', 'parent_category_id', 'child_category_id', 'description', 'price', 'discount', 'special_offer', 'product_code', 'rating', 'total_reviews', 'total_quantities'
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

    // define scope function that return a query with eager loading
    public function scopeInfo($query)
    {
        // return data from relationships
        return $query->with(['parentCategory', 'childCategory', 'user', 'productImages', 'reviews']);
    }

    // define scope function that return a query with eager loading for latest 3 products
    public function scopeGetLatestProducts($query)
    {
        // return data from relationships
        return $query->with(['parentCategory', 'childCategory', 'productImages'])->orderBy('created_at', 'desc')->limit(3);
    }

    // define scope function that return a query with eager loading for latest 3 products
    public function scopeGetLatestDiscountedProducts($query)
    {
        // return data from relationships
        return $query->with(['parentCategory', 'childCategory', 'productImages'])->orderBy('discount', 'desc')->limit(3);
    }

    // define scope function that return a query with eager loading for most commented last 3 products
    public function scopeGetMostCommentedProducts($query)
    {
        // return data from relationships
        return $query->with(['parentCategory', 'childCategory', 'productImages'])->orderBy('total_reviews', 'desc')->limit(3);
    }
}
