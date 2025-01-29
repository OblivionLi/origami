<?php

namespace App\Repositories;

use App\Http\Requests\product\ProductStoreRequest;
use App\Http\Requests\product\ProductUpdateRequest;
use App\Models\ChildCategory;
use App\Models\Product;
use App\Models\ProductImage;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class ProductRepository
{
    /**
     * @return Builder
     */
    public function getProductWithRelations(): Builder
    {
        return Product::with(['parentCategory', 'childCategory', 'user', 'productImages', 'reviews']);
    }

    /**
     * @param ProductStoreRequest $request
     * @return Product|null
     */
    public function createProduct(ProductStoreRequest $request): ?Product
    {
        DB::beginTransaction();

        try {
            $childCategory = ChildCategory::find($request->child_category_id);
            if (!$childCategory) {
                Log::warning("Child Category Not Found");
                return null;
            }

            $product = $this->storeProduct($request, $childCategory->parent_category_id);

            if (!$product) {
                Log::warning("Product failed to create");
                return null;
            }

            $this->storeProductImages($request, $product->id);

            DB::commit();
            return $product;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error while creating product: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * @param ProductStoreRequest $request
     * @param int $productId
     * @return void
     */
    private function storeProductImages(ProductStoreRequest $request, int $productId): void
    {
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $imgFileName = time() . '_' . $file->getClientOriginalName();
                ProductImage::create([
                    'product_id' => $productId,
                    'name' => $imgFileName,
                    'path' => $file->storeAs('productImages', $imgFileName, 'public')
                ]);
            }

            return;
        }

        Log::warning("Product Image Not Found");
    }

    /**
     * @param ProductStoreRequest $request
     * @param int $parentCategoryId
     * @return Product|null
     */
    private function storeProduct(ProductStoreRequest $request, int $parentCategoryId): ?Product
    {
        return Product::create([
            'user_id' => Auth::id(),
            'parent_category_id' => $parentCategoryId,
            'child_category_id' => $request->child_category_id,
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'discount' => $request->discount,
            'special_offer' => $request->special_offer,
            'product_code' => $request->product_code,
            'rating' => 0,
            'total_reviews' => 0,
            'total_quantities' => 0
        ]);
    }

    /**
     * @param ProductUpdateRequest $request
     * @param string $slug
     * @return Product|null
     */
    public function updateProduct(ProductUpdateRequest $request, string $slug): ?Product
    {
        DB::beginTransaction();

        try {
            $product = Product::findBySlug($slug);
            if (!$product) {
                Log::warning("Product Not Found");
                return null;
            }

            $product->slug = null;
            $product->name = $request->name;
            $product->description = $request->description;
            $product->price = $request->price;
            $product->discount = $request->has('discount') ? ($request->discount > 0 ? $request->discount : null) : null;
            $product->special_offer = $request->special_offer;
            $product->product_code = $request->product_code;
            $product->total_quantities = $request->quantity;

            $product->save();

            $childCategory = ChildCategory::find($request->child_category_id);
            if (!$childCategory) {
                Log::warning("Child Category Not Found");
                DB::rollBack();
                return null;
            }
            $product->childCategory()->associate($childCategory);
            $product->parentCategory()->associate($childCategory->parent_category_id);

            DB::commit();
            return $product;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error while updating product: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * @param string $slug
     * @return bool
     */
    public function deleteProduct(string $slug): bool
    {
        DB::beginTransaction();

        try {
            $product = Product::findBySlug($slug);
            if (!$product) {
                Log::warning("Product Not Found");
                return false;
            }

            $images = ProductImage::where('product_id', $product->id)->get();
            if ($images->isEmpty()) {
                Log::warning("Product Image/s Not Found");
                return false;
            }

            foreach ($images as $image) {
                File::delete(public_path('/storage/' . $image->path));
                $image->delete();
            }

            $product->delete();

            DB::commit();
            return true;
        } catch (Exception $e) {
            Log::error('Error while deleting product: ' . $e->getMessage());
            DB::rollBack();
            return false;
        }
    }

    /**
     * @return Builder
     */
    public function getLatestProductsWithRelations(): Builder
    {
        return Product::with(['parentCategory', 'childCategory', 'productImages'])
            ->orderBy('created_at', 'desc')
            ->limit(3);
    }

    /**
     * @return Builder
     */
    public function getLatestDiscountedProductsWithRelations(): Builder
    {
        return Product::with(['parentCategory', 'childCategory', 'productImages'])
            ->orderBy('discount', 'desc')
            ->limit(3);
    }

    /**
     * @return Builder
     */
    public function getMostCommentedProductsWithRelations(): Builder
    {
        return Product::with(['parentCategory', 'childCategory', 'productImages'])
            ->orderBy('total_reviews', 'desc')
            ->limit(3);
    }

    /**
     * @return LengthAwarePaginator
     */
    public function getProductsBySpecialOffers(): LengthAwarePaginator
    {
        return Product::with(['parentCategory', 'childCategory', 'productImages'])->where('special_offer', 1)->paginate(6);
    }
}
