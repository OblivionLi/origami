<?php

namespace App\Services;

use App\Http\Requests\order\OrderStoreRequest;
use App\Http\Resources\order\OrderAdminIndexResource;
use App\Http\Resources\order\OrderIndexResource;
use App\Http\Resources\order\OrderShowResource;
use App\Http\Resources\order\OrderStatsResource;
use App\Models\Order;
use App\Models\User;
use App\Repositories\OrderRepository;
use Barryvdh\DomPDF\PDF;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

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
        return OrderIndexResource::collection($this->orderRepository->getOrderWithRelations(null)->get());
    }

    /**
     * @return AnonymousResourceCollection
     */
    public function getAdminOrderWithRelations(): AnonymousResourceCollection
    {
        return OrderAdminIndexResource::collection($this->orderRepository->getAdminOrderWithRelations()->get());
    }

    /**
     * @param OrderStoreRequest $request
     * @return JsonResponse
     */
    public function storeOrder(OrderStoreRequest $request): JsonResponse
    {
        $savedOrder = $this->orderRepository->createOrder($request->validated());
        if (!$savedOrder) {
            return response()->json(['message' => 'Failed to store order.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json(['message' => 'Order created successfully.'], Response::HTTP_CREATED);
    }

    /**
     * @param string $id
     * @return OrderShowResource|JsonResponse
     */
    public function showOrder(string $id): OrderShowResource|JsonResponse
    {
        $order = $this->orderRepository->getOrderWithRelations($id)->first();
        if (!$order) {
            return response()->json(['message' => 'Order not found.'], Response::HTTP_NOT_FOUND);
        }

        return new OrderShowResource($order);
    }

    /**
     * @param int $id
     * @return JsonResponse
     */
    public function destroyOrder(int $id): JsonResponse
    {
        $tryToDeleteOrder = $this->orderRepository->deleteOrder($id);
        if (!$tryToDeleteOrder) {
            return response()->json(['message' => 'Failed to delete order.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json(['message' => 'Order delete successfully.'], Response::HTTP_OK);
    }

    /**
     * @return AnonymousResourceCollection|JsonResponse
     */
    public function getUserOrders(): AnonymousResourceCollection|JsonResponse
    {
        $order = $this->orderRepository->getUserOrdersWithRelations(Auth::id())->get();
        if (!$order) {
            return response()->json(['message' => 'User has no orders.'], Response::HTTP_NOT_FOUND);
        }

        return OrderIndexResource::collection($order);
    }

    /**
     * @param string $status
     * @param string $id
     * @return OrderShowResource|JsonResponse
     */
    public function updateOrderStatus(string $status, string $id): OrderShowResource|JsonResponse
    {
        $status = strtoupper($status);
        if ($status != 'PAID' && $status != 'DELIVERED') {
            return response()->json(['message' => 'Invalid status.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $order = $this->orderRepository->updateOrderStatus($status, $id);
        if (!$order) {
            return response()->json(['message' => 'Failed to update order status.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new OrderShowResource($order);
    }

    /**
     * @param string $id
     * @return Response|JsonResponse
     */
    public function createOrderPDF(string $id): Response|JsonResponse
    {
        try {
            $order = $this->orderRepository->getOrderWithRelations($id)->first();
            $user = $order->user;
            view()->share('order', $order);
            view()->share('user', $user);

            $pdf = app('dompdf.wrapper');
            $pdf->loadView('invoice.orderPDF', compact('order'));

            return $pdf->download("Order-$id-Invoice.pdf");
        } catch (ModelNotFoundException $e) {
            Log::error($e->getMessage());
            return response()->json(['message' => 'Order not found.'], Response::HTTP_NOT_FOUND);
        }
    }

    /**
     * @return OrderStatsResource
     */
    public function prepareOrderData(): OrderStatsResource
    {
        $orderStats = $this->orderRepository->fetchOrderStats();
        $lastMonthName = Carbon::now()->subMonth()->format('F');
        $userCount = User::count();

        $data = [
            'orderCount' => $orderStats->order_count,
            'userCount' => $userCount,
            'revenueLastMonth' => $orderStats->revenue_last_month,
            'revenueLastMonthName' => $lastMonthName,
            'revenueAllTime' => $orderStats->revenue_all_time,
            'averageRevenue' => $orderStats->average_revenue,
        ];

        return new OrderStatsResource($data);
    }
}
