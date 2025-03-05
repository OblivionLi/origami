<?php

namespace App\Services;

use App\Http\Requests\ProductImageStoreRequest;
use App\Http\Requests\productImg\ProductImageUpdateRequest;
use App\Models\ProductImage;
use App\Repositories\ProductImageRepository;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class ProductImageService
{
    protected ProductImageRepository $productImageRepository;

    public function __construct(ProductImageRepository $productImageRepository)
    {
        $this->productImageRepository = $productImageRepository;
    }

    /**
     * @param int $productId
     * @param ProductImageStoreRequest $request
     * @return JsonResponse
     */
    public function storeProductImage(ProductImageStoreRequest $request, int $productId): JsonResponse
    {
        $imageCount = $this->productImageRepository->getProductImageCount($productId);
        if ($imageCount >= 5) {
            return response()->json(['message' => 'Images list reached its limit.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        if (!$request->hasFile('image')) {
            return response()->json(['message' => 'Request image payload is empty.'], Response::HTTP_BAD_REQUEST);
        }

        $file = $request->file('image');
        $directory = 'productImages';

        try {
            $path = $this->productImageRepository->storeImage($file, $directory);
            $imgFileName = basename($path);

            $data = [
                'product_id' => $productId,
                'name' => $imgFileName,
                'path' => $path
            ];
            ProductImage::create($data);
            return response()->json(['message' => 'Image uploaded successfully.'], Response::HTTP_CREATED);
        } catch (Exception $e) {
            Log::error("Image upload failed for product ID $productId: " . $e->getMessage());
            return response()->json(['message' => 'Failed to upload image.'], Response::HTTP_INTERNAL_SERVER_ERROR);
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
            return response()->json(['message' => 'Request image payload is empty.'], Response::HTTP_BAD_REQUEST);
        }

        $imageToReplace = ProductImage::find($id);

        if (!$imageToReplace) {
            return response()->json(['message' => 'Image not found.'], Response::HTTP_NOT_FOUND);
        }

        $file = $request->file('image');
        $directory = 'productImages';

        $this->productImageRepository->deleteImageFile($imageToReplace->path);

        $newPath = $this->productImageRepository->storeImage($file, $directory);

        $imageToReplace->name = basename($newPath);
        $imageToReplace->path = $newPath;

        try {
            $imageToReplace->save();
        } catch (Exception $e) {
            Log::error('Failed to update image record: ' . $e->getMessage());
            return response()->json(['message' => 'Failed to upload image.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json(['message' => 'Image updated successfully.'], Response::HTTP_OK);
    }

    /**
     * @param int $id
     * @return JsonResponse
     */
    public function destroyProductImage(int $id): JsonResponse
    {
        $tryToDeleteProductImages = $this->productImageRepository->deleteImagesIfExist($id);
        if (!$tryToDeleteProductImages) {
            return response()->json(['message' => 'Failed to delete image.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json(['message' => 'Image deleted successfully.'], Response::HTTP_OK);
    }
}
