<?php

namespace App\Services;

use App\Http\Requests\productImg\ProductImageUpdateRequest;
use App\Models\ProductImage;
use App\Repositories\ProductImageRepository;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductImageService
{
    protected ProductImageRepository $productImageRepository;

    public function __construct(ProductImageRepository $productImageRepository)
    {
        $this->productImageRepository = $productImageRepository;
    }

    /**
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function storeProductImage(Request $request, int $id): JsonResponse
    {
        $images = $this->productImageRepository->getProductImages($id);
        if ($images->isEmpty() || $images->count() < 5) {
            return response()->json(['message' => 'Images list reached its limit'], 404);
        }

        if (!$request->hasFile('image')) {
            return response()->json(['message' => 'Request image payload is empty'], 404);
        }

        $imgFileName = time() . '.' . $request->file('image')->getClientOriginalName();

        try {
            ProductImage::create([
                'product_id' => $id,
                'name' => $imgFileName,
                'path' => $request->file('image')->storeAs('productImages', $imgFileName, 'public')
            ]);
            return response()->json(['message' => 'Image uploaded successfully'], 200);
        } catch (Exception $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'Image upload failed'], 500);
        }
    }

    /**
     * @param ProductImageUpdateRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function updateProductImage(ProductImageUpdateRequest $request, int $id): JsonResponse
    {
        if (!$request->hasFile('image')) {
            return response()->json(['message' => 'Request image payload is empty'], 404);
        }

        $imgFileName = time() . '_' . $request->image->getClientOriginalName();

        $data = [
            'product_id' => $request->product_id,
            'name' => $imgFileName,
            'path' => $request->image->storeAs('productImages', $imgFileName, 'public')
        ];

        $tryToCreateProductImages = $this->productImageRepository->createProductImage($data);
        if (!$tryToCreateProductImages) {
            return response()->json(['message' => 'Image upload failed'], 500);
        }

        // TODO:: this might need cleaning
        $this->productImageRepository->deleteImagesIfExist($id);

        return response()->json(['message' => 'Image updated successfully'], 200);
    }

    /**
     * @param int $id
     * @return JsonResponse
     */
    public function deleteProductImage(int $id): JsonResponse
    {
        if ($this->productImageRepository->deleteImagesIfExist($id)) {
            return response()->json(['message' => 'Image deleted successfully'], 200);
        }

        return response()->json(['message' => 'Image delete failed'], 500);
    }
}
