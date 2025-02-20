<?php

namespace App\Repositories;

use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReviewRepository
{
    /**
     * @param int|string|null $productId
     * @return Builder
     */
    public function getReviewWithRelations(int|string|null $productId): Builder
    {
        if (!$productId) {
            return Review::with(['product', 'user']);
        }

        return Review::with(['product'])->where('product_id', $productId);
    }

    /**
     * @param array $requestData
     * @param int $productId
     * @return bool
     */
    public function createReview(array $requestData, int $productId): bool
    {
        DB::beginTransaction();

        try {
            $product = Product::find($productId);
            if (!$product) {
                return false;
            }

            $existingReview = Review::where([
                ['product_id', '=', $product->id],
                ['user_id', '=', $requestData['user_id']],
            ])->get();

            if ($existingReview->isEmpty()) {
                return false;
            }

            if ($existingReview->count() >= 1) {
                return false;
            }

            Review::create([
                'product_id' => $product->id,
                'user_id' => $requestData['user_id'],
                'user_name' => $requestData['username'],
                'rating' => $requestData['rating'],
                'user_comment' => $requestData['comment'],
            ]);

            $reviews = Review::where('product_id', $product->id)->get();
            if ($reviews->isEmpty()) {
                return false;
            }

            $product->total_reviews = $reviews->count();
            $product->rating = $reviews->avg('rating');

            $product->save();

            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error while creating review: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * @param array $requestData
     * @param int $reviewId
     * @return null|Review
     */
    public function updateReview(array $requestData, int $reviewId): null|Review
    {
        try {
            $review = Review::find($reviewId);
            if (!$review) {
                return null;
            }

            $userId = Auth::id();
            if(!$userId) {
                return null;
            }

            $user = User::find($userId);
            if (!$user) {
                return null;
            }

            $review->admin_name = $user->name;
            $review->user_comment = $requestData['user_comment'];
            $review->admin_comment = $requestData['admin_comment'];

            $review->save();

            return $review;
        } catch (Exception $e) {
            Log::error('Error while updating review: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * @param int $reviewId
     * @return Review|null
     */
    public function getReviewById(int $reviewId): ?Review
    {
        return Review::find($reviewId);
    }

    /**
     * @param int $id
     * @return bool
     */
    public function deleteReview(int $id): bool
    {
        try {
            $review = Review::find($id);
            if (!$review) {
                return false;
            }

            $review->delete();
            return true;
        } catch (Exception $e) {
            Log::error('Database error deleting review: ' . $e->getMessage());
            return false;
        }
    }
}
