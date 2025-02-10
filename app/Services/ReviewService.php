<?php

namespace App\Services;

use App\Http\Requests\review\ReviewStoreRequest;
use App\Http\Requests\review\ReviewUpdateRequest;
use App\Http\Resources\review\ReviewIndexResource;
use App\Http\Resources\review\ReviewShowResource;
use App\Repositories\ReviewRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

class ReviewService
{
    protected ReviewRepository $reviewRepository;

    public function __construct(ReviewRepository $reviewRepository)
    {
        $this->reviewRepository = $reviewRepository;
    }

    /**
     * @param int|string|null $productId
     * @return LengthAwarePaginator|AnonymousResourceCollection
     */
    public function getReviewWithRelations(int|string|null $productId): LengthAwarePaginator|AnonymousResourceCollection
    {
        if ($productId) {
            return ReviewIndexResource::collection($this->reviewRepository->getReviewWithRelations($productId)->paginate(6));
        }

        return ReviewIndexResource::collection($this->reviewRepository->getReviewWithRelations(null)->get());
    }

    /**
     * @param ReviewStoreRequest $request
     * @param string $slug
     * @return JsonResponse
     */
    public function storeReview(ReviewStoreRequest $request, string $slug): JsonResponse
    {
        $tryToStoreReview = $this->reviewRepository->createReview($request->validated(), $slug);
        if (!$tryToStoreReview) {
            return response()->json(['message' => 'Failed to create review.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        return response()->json(['message' => 'Review created successfully.'], Response::HTTP_CREATED);
    }

    /**
     * @param int $id
     * @return ReviewShowResource|JsonResponse
     */
    public function showReview(int $id): ReviewShowResource|JsonResponse
    {
        $review = $this->reviewRepository->getReviewById($id);
        if (!$review) {
            return response()->json(['message' => 'Review not found.'], Response::HTTP_NOT_FOUND);
        }

        return new ReviewShowResource($review);
    }

    /**
     * @param ReviewUpdateRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function updateReview(ReviewUpdateRequest $request, int $id): JsonResponse
    {
        $tryToUpdateReview = $this->reviewRepository->updateReview($request->validated(), $id);
        if (!$tryToUpdateReview) {
            return response()->json(['message' => 'Failed to update review.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        return response()->json(['message' => 'Review updated successfully.'], Response::HTTP_OK);
    }

    /**
     * @param int $id
     * @return JsonResponse
     */
    public function destroyReview(int $id): JsonResponse
    {
        $tryToDeleteReview = $this->reviewRepository->deleteReview($id);
        if (!$tryToDeleteReview) {
            return response()->json(['message' => 'Failed to delete review.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        return response()->json(['message' => 'Review deleted successfully.'], Response::HTTP_OK);
    }
}
