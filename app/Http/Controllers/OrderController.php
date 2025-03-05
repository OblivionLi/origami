<?php

namespace App\Http\Controllers;

use App\Http\Requests\order\OrderStoreRequest;
use App\Http\Requests\order\OrderUpdateStatusRequest;
use App\Http\Resources\order\OrderIndexResource;
use App\Http\Resources\order\OrderShowResource;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class OrderController extends Controller
{
    protected OrderService $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    /**
     * @return AnonymousResourceCollection
     */
    public function index(): AnonymousResourceCollection
    {
        return $this->orderService->getOrderWithRelations();
    }

    /**
     * @return AnonymousResourceCollection
     */
    public function indexAdmin(): AnonymousResourceCollection
    {
        return $this->orderService->getAdminOrderWithRelations();
    }

    /**
     * @param OrderStoreRequest $request
     * @return JsonResponse
     */
    public function store(OrderStoreRequest $request): JsonResponse
    {
        return $this->orderService->storeOrder($request);
    }

    /**
     * @param string $id
     * @return OrderShowResource|JsonResponse
     */
    public function show(string $id): OrderShowResource|JsonResponse
    {
        return $this->orderService->showOrder($id);
    }

    /**
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        return $this->orderService->destroyOrder($id);
    }

    /**
     * @param string $id
     * @param OrderUpdateStatusRequest $request
     * @return OrderShowResource|JsonResponse
     */
    public function updateOrderStatus(string $id, OrderUpdateStatusRequest $request): OrderShowResource|JsonResponse
    {
        return $this->orderService->updateOrderStatus($request->validated()['status'], $id);
    }

    /**
     * @return AnonymousResourceCollection|JsonResponse
     */
    public function getUserOrders(): AnonymousResourceCollection|JsonResponse
    {
        return $this->orderService->getUserOrders();
    }

    /**
     * @param string $id
     * @return JsonResponse|Response
     */
    public function createPDF(string $id): JsonResponse|Response
    {
        return $this->orderService->createOrderPDF($id);
    }

    /**
     * @return JsonResponse
     */
    public function orderCharts(): JsonResponse
    {
        return $this->orderService->prepareOrderData();
    }
}
