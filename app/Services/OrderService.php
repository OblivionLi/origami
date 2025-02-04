<?php

namespace App\Services;

use App\Http\Requests\order\OrderStoreRequest;
use App\Http\Resources\order\OrderIndexResource;
use App\Http\Resources\order\OrderShowResource;
use App\Models\Order;
use App\Models\User;
use App\Repositories\OrderRepository;
use Barryvdh\DomPDF\PDF;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class OrderService
{
    protected OrderRepository $orderRepository;

    public function __construct(OrderRepository $orderRepository)
    {
        $this->orderRepository = $orderRepository;
    }

    /**
     * @return AnonymousResourceCollection
     */
    public function getOrderWithRelations(): AnonymousResourceCollection
    {
        return OrderIndexResource::collection($this->orderRepository->getOrderWithRelations());
    }

    /**
     * @param OrderStoreRequest $request
     * @return JsonResponse
     */
    public function storeOrder(OrderStoreRequest $request): JsonResponse
    {
        $savedOrder = $this->orderRepository->createOrder($request);
        if (!$savedOrder) {
            return response()->json(['message' => 'Order store failed'], 500);
        }

        return response()->json(['message' => 'Order create success'], 200);
    }

    /**
     * @param int $id
     * @return OrderShowResource|JsonResponse
     */
    public function showOrder(int $id): OrderShowResource|JsonResponse
    {
        try {
            $order = $this->orderRepository->getOrderWithRelations($id);
            return new OrderShowResource($order);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Order not found'], 404);
        }
    }

    /**
     * @param int $id
     * @return JsonResponse
     */
    public function deleteOrder(int $id): JsonResponse
    {
        $tryToDeleteOrder = $this->orderRepository->deleteProduct($id);
        if (!$tryToDeleteOrder) {
            return response()->json(['message' => 'Order delete failed'], 422);
        }

        return response()->json(['message' => 'Order delete success'], 200);
    }

    /**
     * @return OrderIndexResource|JsonResponse
     */
    public function getUserOrders(): OrderIndexResource|JsonResponse
    {
        try {
            $order = $this->orderRepository->getUserOrderWithRelations(Auth::id());
            return new OrderIndexResource($order);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'User has no orders'], 404);
        }
    }

    /**
     * @param string $status
     * @param int $id
     * @return OrderShowResource|JsonResponse
     */
    public function updateOrderStatus(string $status, int $id): OrderShowResource|JsonResponse
    {
        $status = strtoupper($status);
        if ($status != 'PAID' || $status != 'DELIVERED') {
            return response()->json(['message' => 'Invalid status'], 400);
        }

        $order = $this->orderRepository->updateOrderStatus($status, $id);
        if (!$order) {
            return response()->json(['message' => 'Order status update failed'], 500);
        }

        return new OrderShowResource($order);
    }

    /**
     * @param int $id
     * @return Response|JsonResponse
     */
    public function createOrderPDF(int $id): Response|JsonResponse
    {
        // TODO:: this needs cleaning
        try {
            $order = $this->orderRepository->getOrderWithRelations($id);

            view()->share('order', $order);
            $pdf = PDF::loadView('invoice.orderPDF', [$order]);

            return $pdf->download('Your-Order-Invoice.pdf');
            // return $pdf->stream();
        } catch (ModelNotFoundException $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'Order not found'], 404);
        }
    }

    /**
     * @return JsonResponse
     */
    public function prepareOrderData(): JsonResponse
    {
        // TODO:: this needs cleaning
        $orderCount = Order::orderCount();
        $revenueLastMonth = Order::revenueLastMonth();
        $revenueAllTime = Order::revenueAllTime();
        $averageRevenue = Order::averageRevenue();
        $userCount = User::userCount();

        $data = [
            'orderCount' => $orderCount,
            'userCount' => $userCount,
            'revenueLastMonth' => $revenueLastMonth,
            'revenueAllTime' => $revenueAllTime,
            'averageRevenue' => $averageRevenue,

        ];

        return response()->json($data);
    }
}
