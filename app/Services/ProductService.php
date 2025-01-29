<?php

namespace App\Services;

use App\Http\Requests\product\ProductStoreRequest;
use App\Http\Requests\product\ProductUpdateRequest;
use App\Http\Resources\product\ProductIndexResource;
use App\Http\Resources\product\ProductShowResource;
use App\Models\ChildCategory;
use App\Models\ParentCategory;
use App\Models\Product;
use App\Repositories\ProductRepository;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Log;

class ProductService
{
    protected ProductRepository $productRepository;

    public function __construct(ProductRepository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    /**
     * @return AnonymousResourceCollection
     */
    public function getProductsWithRelations(): AnonymousResourceCollection
    {
        return ProductIndexResource::collection($this->productRepository->getProductWithRelations());
    }

    /**
     * @param ProductStoreRequest $request
     * @return JsonResponse
     */
    public function storeProduct(ProductStoreRequest $request): JsonResponse
    {
        $savedProduct = $this->productRepository->createProduct($request->validated());
        if (!$savedProduct) {
            return response()->json(['message' => 'Product store failed'], 500);
        }

        return response()->json(['message' => 'Product create success'], 200);
    }

    /**
     * @param string $slug
     * @return ProductShowResource|JsonResponse
     */
    public function showProductWithRelations(string $slug): ProductShowResource|JsonResponse
    {
        try {
            $product = Product::findBySlug($slug);
            if (!$product) {
                return response()->json(['message' => 'Product does not exist..'], 422);
            }

            return new ProductShowResource($product);
        } catch (Exception $e) {
            Log::error("Error trying to find product by slug: " . $e->getMessage());
            return response()->json(['message' => 'Error trying to find product by slug'], 500);
        }
    }

    /**
     * @param ProductUpdateRequest $request
     * @param string $slug
     * @return JsonResponse
     */
    public function updateProduct(ProductUpdateRequest $request, string $slug): JsonResponse
    {
        $product = $this->productRepository->updateProduct($request, $slug);
        if (!$product) {
            return response()->json(['message' => 'Product does not exist'], 422);
        }

        return response()->json(['message', 'Product update success'], 200);
    }

    /**
     * @param string $slug
     * @return JsonResponse
     */
    public function deleteProduct(string $slug): JsonResponse
    {
        $tryToDeleteProduct = $this->productRepository->deleteProduct($slug);
        if (!$tryToDeleteProduct) {
            return response()->json(['message' => 'Product delete failed'], 422);
        }

        return response()->json(['message' => 'Product delete success'], 200);
    }

    /**
     * @return JsonResponse
     */
    public function getShowcaseOfProducts(): JsonResponse
    {
        $showcase = [
            'latestProducts' => $this->productRepository->getLatestProductsWithRelations()->get(),
            'latestDiscounts' => $this->productRepository->getLatestDiscountedProductsWithRelations()->get(),
            'mostCommented' => $this->productRepository->getMostCommentedProductsWithRelations()->get(),
        ];

        return response()->json($showcase, 200);
    }

    /**
     * @param string $category
     * @return JsonResponse
     */
    public function getProductsByCategory(string $category): JsonResponse
    {
        $parentCategory = ParentCategory::where('name', $category)->first();
        if (!$parentCategory) {
            return response()->json(['message' => 'Category does not exist'], 422);
        }

        $productsWithPag = Product::info()->where('parent_category_id', $category->id)->paginate(6);
        $products = Product::info()->where('parent_category_id', $category->id)->get();
        $childCat = ChildCategory::info()->where('parent_category_id', $category->id)->get();

        $data = [
            'productsWithPag' => $productsWithPag,
            'products' => $products,
            'childCat' => $childCat
        ];

        return response()->json($data, 200);
    }

    /**
     * @return JsonResponse
     */
    public function getProductsBySpecialOffers(): JsonResponse
    {
        $products = $this->productRepository->getProductsBySpecialOffers();
        if (!$products) {
            return response()->json(['message' => 'Products does not exist'], 422);
        }
        return response()->json($products, 200);
    }
}
