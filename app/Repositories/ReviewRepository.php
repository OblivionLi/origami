<?php

namespace App\Repositories;

use App\Http\Requests\review\ReviewStoreRequest;
use App\Http\Requests\review\ReviewUpdateRequest;
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
     * @param ReviewStoreRequest $request
     * @param string $slug
     * @return bool
     */
    public function createReview(ReviewStoreRequest $request, string $slug): bool
    {
        DB::beginTransaction();

        try {
            $product = Product::where('slug', $slug)->firstOrFail();
            if (!$product) {
                Log::warning('Product not found', ['slug' => $slug]);
                return false;
            }

            $existingReview = Review::where([
                ['product_id', '=', $product->id],
                ['user_id', '=', $request->user_id]
            ])->get();

            if ($existingReview->isEmpty()) {
                Log::warning('Review not found', ['slug' => $slug]);
                return false;
            }

            if ($existingReview->count() >= 1) {
                Log::warning('Review already exists', ['slug' => $slug]);
                return false;
            }

            Review::create([
                'product_id' => $product->id,
                'user_id' => $request->user_id,
                'user_name' => $request->username,
                'rating' => $request->rating,
                'user_comment' => $request->comment
            ]);

            $reviews = Review::where('product_id', $product->id)->get();
            if ($reviews->isEmpty()) {
                Log::warning('Reviews not found', ['slug' => $slug]);
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
     * @param ReviewUpdateRequest $request
     * @param int $reviewId
     * @return bool
     */
    public function updateReview(ReviewUpdateRequest $request, int $reviewId): bool
    {
        try {
            $review = Review::find($reviewId);
            if (!$review) {
                Log::warning('Review not found', ['slug' => $reviewId]);
                return false;
            }

            $userId = Auth::id();
            if(!$userId) {
                Log::warning('User not logged in', ['user_id' => $userId]);
                return false;
            }

            $user = User::find($userId);
            if (!$user) {
                Log::warning('User not logged in', ['user_id' => $userId]);
                return false;
            }

            $review->admin_name = $user->name;
            $review->user_comment = $request->user_comment;
            $review->admin_comment = $request->admin_comment;

            $review->save();

            return true;
        } catch (Exception $e) {
            Log::error('Error while updating review: ' . $e->getMessage());
            return false;
        }
    }
}
