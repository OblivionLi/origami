<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;
use Cviebrock\EloquentSluggable\SluggableScopeHelpers;

class ChildCategory extends Model
{
    use HasFactory, Sluggable, SluggableScopeHelpers;

    protected $fillable = [
        'name', 'quantity', 'parent_category_id'
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
     * Get the parent category that owns the child category
     */
    public function parentCategory()
    {
        return $this->belongsTo(ParentCategory::class, 'parent_category_id');
    }

    /**
     * Get the products for the parent category
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    // define scope function that return a query with eager loading
    public function scopeInfo($query)
    {
        // return data from relationships
        return $query->with(['parentCategory', 'products']);
    }
}
