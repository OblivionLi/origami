<?php

namespace App\Http\Controllers;

use App\Http\Requests\review\ReviewStoreRequest;
use App\Http\Requests\review\ReviewUpdateRequest;
use App\Http\Resources\review\ReviewIndexResource;
use App\Http\Resources\review\ReviewShowResource;
use App\Services\ReviewService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ReviewController extends Controller
{
    protected ReviewService $reviewService;

    public function __construct(ReviewService $reviewService)
    {
        $this->reviewService = $reviewService;
    }

    /**
     * @param int $productId
     * @return AnonymousResourceCollection
     */
    public function index(int $productId): AnonymousResourceCollection
    {
        return ReviewIndexResource::collection($this->reviewService->getReviewWithRelations($productId));
    }

    /**
     * @param ReviewStoreRequest $request
     * @param int $productId
     * @return JsonResponse
     */
    public function store(ReviewStoreRequest $request, int $productId): JsonResponse
    {
        return $this->reviewService->storeReview($request, $productId);
    }

    /**
     * @param int $id
     * @return ReviewShowResource|JsonResponse
     */
    public function show(int $id): ReviewShowResource|JsonResponse
    {
        return $this->reviewService->showReview($id);
    }

    /**
     * @param ReviewUpdateRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(ReviewUpdateRequest $request, int $id): JsonResponse
    {
        return $this->reviewService->updateReview($request, $id);
    }

    /**
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        return $this->reviewService->destroyReview($id);
    }
}
