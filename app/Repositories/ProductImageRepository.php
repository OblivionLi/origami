<?php

namespace App\Repositories;

use App\Models\ProductImage;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class ProductImageRepository
{

    /**
     * @param int $productId
     * @return Collection
     */
    public function getProductImages(int $productId): Collection
    {
        return ProductImage::where('product_id', $productId)->get();
    }

    /**
     * @param array $data
     * @return bool
     */
    public function createProductImage(array $data): bool
    {
        try {
            ProductImage::create([
                'product_id' => $data['product_id'],
                'name' => $data['name'],
                'path' => $data['path']->storeAs('productImages', $data['name'], 'public')
            ]);
            return true;
        } catch (Exception $e) {
            Log::error('Error creating product images: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * @param int $id
     * @return bool
     */
    public function deleteImagesIfExist(int $id): bool
    {
        try {
            $currentImage = ProductImage::find($id)->first();
            if (!$currentImage) {
                Log::error('Product image not found');
                return false;
            }

            $currentImagePath = public_path('/storage/' . $currentImage->path);

            if (File::exists($currentImagePath)) {
                File::delete($currentImagePath);
                $currentImage->delete();
            }

            return true;
        } catch (Exception $e) {
            Log::warning('Error replacing product images: ' . $e->getMessage());
            return false;
        }
    }
}
