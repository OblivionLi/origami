<?php

namespace App\Repositories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;

class ProductRepository
{
    public function getProductWithRelations(): Builder
    {
        return Product::with(['parentCategory', 'childCategory', 'user', 'productImages', 'reviews']);
    }

    public function getLatestProductsWithRelations(): Builder
    {
        return Product::with(['parentCategory', 'childCategory', 'productImages'])
            ->orderBy('created_at', 'desc')
            ->limit(3);
    }

    public function getLatestDiscountedProductsWithRelations(): Builder
    {
        return Product::with(['parentCategory', 'childCategory', 'productImages'])
            ->orderBy('discount', 'desc')
            ->limit(3);
    }

    public function getMostCommentedProductsWithRelations(): Builder
    {
        return Product::with(['parentCategory', 'childCategory', 'productImages'])
            ->orderBy('total_reviews', 'desc')
            ->limit(3);
    }
}
