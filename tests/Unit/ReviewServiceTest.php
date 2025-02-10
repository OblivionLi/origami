<?php


use App\Http\Requests\review\ReviewStoreRequest;
use App\Http\Requests\review\ReviewUpdateRequest;
use App\Http\Resources\review\ReviewIndexResource;
use App\Http\Resources\review\ReviewShowResource;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use App\Repositories\ReviewRepository;
use App\Services\ReviewService;
use Illuminate\Events\Dispatcher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;
use Tests\TestCase;

class ReviewServiceTest extends TestCase
{
    protected ReviewService $reviewService;
    protected ReviewRepository $reviewRepository;

    public function setUp(): void
    {
        parent::setUp();

        $this->app->bind('events', function () {
            $mockDispatcher = Mockery::mock(Dispatcher::class);
            $mockDispatcher->shouldAllowMockingProtectedMethods();
            $mockDispatcher->shouldReceive('dispatch')->zeroOrMoreTimes();
            return $mockDispatcher;
        });

        $this->reviewRepository = Mockery::mock(ReviewRepository::class);
        $this->reviewService = new ReviewService($this->reviewRepository);
    }

    public function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_get_reviews_with_relations_returns_resource_collection(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();
        $reviews = Review::factory()->count(3)->make();
        $reviews->each(function ($review) {
            $review->setRelation('product', Product::factory()->make());
            $review->setRelation('user', User::factory()->make());
        });

        $collection = new Collection($reviews);

        $mockBuilder = Mockery::mock(Builder::class);
        $mockBuilder->shouldReceive('get')
            ->once()
            ->andReturn($collection);

        $this->reviewRepository->shouldReceive('getReviewWithRelations')
            ->once()
            ->with(null)
            ->andReturn($mockBuilder);

        $result = $this->reviewService->getReviewWithRelations(null);

        $this->assertInstanceOf(AnonymousResourceCollection::class, $result);
        $this->assertEquals(ReviewIndexResource::class, $result->collects);

        $this->assertCount(3, $result->collection);
    }

    public function test_store_review_success(): void
    {
        $request = Mockery::mock(ReviewStoreRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn(['user_comment' => 'Review Test comment']);

        $slug = 'review-slug';
        $this->reviewRepository->shouldReceive('createReview')
            ->once()
            ->with(['user_comment' => 'Review Test comment'], $slug)
            ->andReturn(true);

        $response = $this->reviewService->storeReview($request, $slug);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(201, $response->getStatusCode());
        $this->assertEquals(['message' => 'Review created successfully.'], $response->getData(true));
    }

    public function test_store_review_failure(): void
    {
        $request = Mockery::mock(ReviewStoreRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn(['user_comment' => 'Review Test comment']);

        $slug = 'review-slug';
        $this->reviewRepository->shouldReceive('createReview')
            ->once()
            ->with(['user_comment' => 'Review Test comment'], $slug)
            ->andReturn(false);

        $response = $this->reviewService->storeReview($request, $slug);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(500, $response->getStatusCode());
        $this->assertEquals(['message' => 'Failed to create review.'], $response->getData(true));
    }

    public function test_show_review_with_relations_success(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $review = Review::factory()->make(['user_comment' => 'Review Test comment', 'admin_comment' => 'Review Test admin comment']);

        $this->reviewRepository->shouldReceive('getReviewById')
            ->with(20)
            ->andReturn($review);

        $result = $this->reviewService->showReview(20);

        $this->assertInstanceOf(ReviewShowResource::class, $result);
        $this->assertEquals('Review Test comment', $result->user_comment);
    }

    public function test_show_review_with_relations_not_found(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $this->reviewRepository->shouldReceive('getReviewById')
            ->with(1)
            ->andReturn(null);

        $result = $this->reviewService->showReview(1);

        $this->assertInstanceOf(JsonResponse::class, $result);
        $this->assertEquals(404, $result->getStatusCode());
        $this->assertEquals(['message' => 'Review not found.'], $result->getData(true));
    }

    public function test_update_review_success(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $request = Mockery::mock(ReviewUpdateRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn(['user_comment' => 'Review Test comment', 'admin_comment' => 'Review Test admin comment']);

        $review = Review::factory()->make(['user_comment' => 'Review Test comment', 'admin_comment' => 'Review Test admin comment']);

        $this->reviewRepository->shouldReceive('updateReview')
            ->once()
            ->with(['user_comment' => 'Review Test comment', 'admin_comment' => 'Review Test admin comment'], 1)
            ->andReturn($review);

        $response = $this->reviewService->updateReview($request, 1);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals(['message' => 'Review updated successfully.'], $response->getData(true));
    }

    public function test_update_review_not_found(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $request = Mockery::mock(ReviewUpdateRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn(['user_comment' => 'Review Test comment', 'admin_comment' => 'Review Test admin comment']);

        $this->reviewRepository->shouldReceive('updateReview')
            ->once()
            ->with(['user_comment' => 'Review Test comment', 'admin_comment' => 'Review Test admin comment'], 2)
            ->andReturn(null);

        $response = $this->reviewService->updateReview($request, 2);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(422, $response->getStatusCode());
    }

    public function test_delete_review_success(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $this->reviewRepository->shouldReceive('deleteReview')
            ->once()
            ->with(1)
            ->andReturn(true);

        $response = $this->reviewService->destroyReview(1);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
    }

    public function test_delete_review_failure(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $this->reviewRepository->shouldReceive('deleteReview')
            ->once()
            ->with(1)
            ->andReturn(false);

        $response = $this->reviewService->destroyReview(1);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(500, $response->getStatusCode());
    }
}
