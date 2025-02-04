<?php

namespace App\Services;

use App\Http\Requests\review\ReviewStoreRequest;
use App\Http\Requests\review\ReviewUpdateRequest;
use App\Http\Resources\review\ReviewShowResource;
use App\Models\Review;
use App\Repositories\ReviewRepository;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;

class ReviewService
{
    protected ReviewRepository $reviewRepository;

    public function __construct(ReviewRepository $reviewRepository)
    {
        $this->reviewRepository = $reviewRepository;
    }

    /**
     * @param int|string|null $productId
     * @return LengthAwarePaginator|Collection
     */
    public function getReviewWithRelations(int|string|null $productId): LengthAwarePaginator|Collection
    {
        if ($productId) {
            return $this->reviewRepository->getReviewWithRelations($productId)->paginate(6);
        }

        return $this->reviewRepository->getReviewWithRelations(null)->get();
    }

    /**
     * @param ReviewStoreRequest $request
     * @param string $slug
     * @return JsonResponse
     */
    public function storeReview(ReviewStoreRequest $request, string $slug): JsonResponse
    {
        $tryToStoreReview = $this->reviewRepository->createReview($request, $slug);
        if ($tryToStoreReview) {
            return response()->json(['message' => 'Review created'], 201);
        }
        return response()->json(['message' => 'Review not created'], 500);
    }

    /**
     * @param int $reviewId
     * @return ReviewShowResource|JsonResponse
     */
    public function showReview(int $reviewId): ReviewShowResource|JsonResponse
    {
        try {
            $review = Review::find($reviewId);
            if (!$review) {
                return response()->json(['message' => 'Review not found'], 404);
            }

            return new ReviewShowResource($review);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function updateReview(ReviewUpdateRequest $request, int $reviewId): JsonResponse
    {
        $tryToUpdateReview = $this->reviewRepository->updateReview($request, $reviewId);
        if (!$tryToUpdateReview) {
            return response()->json(['message' => 'Review not updated'], 500);
        }
        return response()->json(['message' => 'Review updated'], 200);
    }

    /**
     * @param int $reviewId
     * @return JsonResponse
     */
    public function deleteReview(int $reviewId): JsonResponse
    {
        try {
            $review = Review::find($reviewId);
            if (!$review) {
                return response()->json(['message' => 'Review not found'], 404);
            }

            $review->delete();
            return response()->json(['message' => 'Review deleted'], 200);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
