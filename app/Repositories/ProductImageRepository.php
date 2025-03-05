<?php

namespace App\Repositories;

use App\Models\ProductImage;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class ProductImageRepository
{

    /**
     * @param int $productId
     * @return int
     */
    public function getProductImageCount(int $productId): int
    {
        return ProductImage::where('product_id', $productId)->count();
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
            $currentImage = ProductImage::find($id);
            if (!$currentImage) {
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

    /**
     * @param string $path
     * @return bool
     */
    public function deleteImageFile(string $path): bool
    {
        try {
            $imagePath = public_path('/storage/' . $path);
            if (File::exists($imagePath)) {
                File::delete($imagePath);
                return true;
            }
        } catch (Exception $e) {
            Log::warning('Error deleting product image: ' . $e->getMessage());
        }
        return false;
    }

    /**
     * @param UploadedFile $file
     * @param string $directory
     * @param string $disk
     * @return string
     */
    public function storeImage(UploadedFile $file, string $directory, string $disk = 'public'): string
    {
        $imgFileName = time() . '.' . $file->getClientOriginalName();
        return  $file->storeAs($directory, $imgFileName, $disk);
    }
}
