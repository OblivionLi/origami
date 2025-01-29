<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Cviebrock\EloquentSluggable\SluggableScopeHelpers;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $slug
 * @property string $name
 * @property string $description
 * @property double $price
 * @property int $discount
 * @property boolean $special_offer
 * @property string $product_code
 * @property int $total_quantities
 */
class Product extends Model
{
    use HasFactory, Sluggable, SluggableScopeHelpers;

    /**
     * @var array[int, string]
     */
    protected $fillable = [
        'id', 'name', 'user_id', 'parent_category_id', 'child_category_id', 'description', 'price', 'discount', 'special_offer', 'product_code', 'rating', 'total_reviews', 'total_quantities'
    ];

    /**
     * Return the sluggable configuration array for this model.
     *
     * @return array[string, array]
     */
    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'name'
            ]
        ];
    }

    public function parentCategory(): BelongsTo
    {
        return $this->belongsTo(ParentCategory::class, 'parent_category_id');
    }

    public function childCategory(): BelongsTo
    {
        return $this->belongsTo(ChildCategory::class, 'child_category_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function productImages(): HasMany
    {
        return $this->hasMany(ProductImage::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}
