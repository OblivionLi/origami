<?php

namespace App\Services;

use App\Http\Requests\ProductImageStoreRequest;
use App\Http\Requests\productImg\ProductImageUpdateRequest;
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
     * @param ProductImageStoreRequest $request
     * @return JsonResponse
     */
    public function storeProductImage(ProductImageStoreRequest $request): JsonResponse
    {
        $id = $request->product_id;
        $imageCount = $this->productImageRepository->getProductImageCount($id);
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
                'product_id' => $id,
                'name' => $imgFileName,
                'path' => $path
            ];

            $this->productImageRepository->createProductImage($data);
            return response()->json(['message' => 'Image uploaded successfully.'], Response::HTTP_CREATED);
        } catch (Exception $e) {
            Log::error("Image upload failed for product ID $id: " . $e->getMessage());
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

        $file = $request->file('image');
        $directory = 'productImages';


        $path = $this->productImageRepository->storeImage($file, $directory);
        $imgFileName = basename($path);

        $data = [
            'product_id' => $id,
            'name' => $imgFileName,
            'path' => $path
        ];

        $tryToCreateProductImages = $this->productImageRepository->createProductImage($data);
        if (!$tryToCreateProductImages) {
            return response()->json(['message' => 'Failed to upload image.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        // TODO:: this might need cleaning
        $this->productImageRepository->deleteImagesIfExist($id);

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
