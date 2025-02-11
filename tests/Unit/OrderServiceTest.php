<?php


use App\Http\Requests\order\OrderStoreRequest;
use App\Http\Resources\order\OrderIndexResource;
use App\Http\Resources\order\OrderShowResource;
use App\Models\Order;
use App\Repositories\OrderRepository;
use App\Services\OrderService;
use Illuminate\Events\Dispatcher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;
use Tests\TestCase;

class OrderServiceTest extends TestCase
{
    protected OrderService $orderService;
    protected OrderRepository $orderRepository;

    public function setUp(): void
    {
        parent::setUp();

        $this->app->bind('events', function () {
            $mockDispatcher = Mockery::mock(Dispatcher::class);
            $mockDispatcher->shouldAllowMockingProtectedMethods();
            $mockDispatcher->shouldReceive('dispatch')->zeroOrMoreTimes();
            return $mockDispatcher;
        });

        $this->orderRepository = Mockery::mock(OrderRepository::class);
        $this->orderService = new OrderService($this->orderRepository);
    }

    public function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

//    public function test_get_orders_with_relations_returns_resource_collection(): void
//    {
//        Log::shouldReceive('error')->zeroOrMoreTimes();
//        $orders = Order::factory()->count(3)->make();
//        $collection = new Collection($orders);
//
//        $mockBuilder = Mockery::mock(Builder::class);
//        $mockBuilder->shouldReceive('get')
//            ->once()
//            ->andReturn($collection);
//
//        $this->orderRepository->shouldReceive('getOrderWithRelations')
//            ->once()
//            ->with()
//            ->andReturn($mockBuilder);
//
//        $result = $this->orderService->getOrdersWithRelations();
//
//        $this->assertInstanceOf(AnonymousResourceCollection::class, $result);
//        $this->assertEquals(OrderIndexResource::class, $result->collects);
//
//        $this->assertCount(3, $result->collection);
//    }

    public function test_store_order_success(): void
    {
        $request = Mockery::mock(OrderStoreRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn(['order_id' => '001']);

        $this->orderRepository->shouldReceive('createOrder')
            ->once()
            ->with(['order_id' => '001'])
            ->andReturn(new Order());

        $response = $this->orderService->storeOrder($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(201, $response->getStatusCode());
        $this->assertEquals(['message' => 'Order created successfully.'], $response->getData(true));
    }

    public function test_store_order_failed(): void
    {
        $request = Mockery::mock(OrderStoreRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->andReturn(['order_id' => '001']);

        $this->orderRepository->shouldReceive('createOrder')
            ->once()
            ->with(['order_id' => '001'])
            ->andReturn(null);

        $response = $this->orderService->storeOrder($request);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(500, $response->getStatusCode());
        $this->assertEquals(['message' => 'Failed to storeOld order.'], $response->getData(true));
    }

    public function test_show_order_with_relations_success(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $order = Order::factory()->make(['order_id' => '001']);

        $builderMock = Mockery::mock(Builder::class);
        $builderMock->shouldReceive('first')->once()->andReturn($order);

        $this->orderRepository->shouldReceive('getOrderWithRelations')
            ->with(1)
            ->andReturn($builderMock);

        $result = $this->orderService->showOrder(1);

        $this->assertInstanceOf(OrderShowResource::class, $result);
        $this->assertEquals('001', $result->order_id);
    }

    public function test_show_order_with_relations_failed(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $builderMock = Mockery::mock(Builder::class);
        $builderMock->shouldReceive('first')->once()->andReturn(null);

        $this->orderRepository->shouldReceive('getOrderWithRelations')
            ->with(1)
            ->andReturn($builderMock);

        $result = $this->orderService->showOrder(1);

        $this->assertInstanceOf(JsonResponse::class, $result);
        $this->assertEquals(['message' => 'Order not found.'], $result->getData(true));
    }

    public function test_delete_order_success(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $this->orderRepository->shouldReceive('deleteOrder')
            ->once()
            ->with(1)
            ->andReturn(true);

        $response = $this->orderService->destroyOrder(1);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals(['message' => 'Order delete successfully.'], $response->getData(true));
    }

    public function test_delete_order_failed(): void
    {
        Log::shouldReceive('error')->zeroOrMoreTimes();

        $this->orderRepository->shouldReceive('deleteOrder')
            ->once()
            ->with(1)
            ->andReturn(false);

        $response = $this->orderService->destroyOrder(1);

        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(500, $response->getStatusCode());
        $this->assertEquals(['message' => 'Failed to delete order.'], $response->getData(true));
    }
}
