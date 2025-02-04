<?php

namespace App\Repositories;

use App\Http\Requests\order\OrderStoreRequest;
use App\Models\Order;
use Carbon\Carbon;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class OrderRepository
{
    /**
     * @param int|string|null $id
     * @return Builder
     */
    public function getOrderWithRelations(int|string|null $id): Builder
    {
        if ($id) {
            return Order::with(['user', 'products', 'user.addresses'])->where('order_id', $id)->firstOrFail();
        }

        return Order::with(['user', 'products', 'user.addresses']);
    }

    /**
     * @param int $id
     * @return Order|Model
     */
    public function getUserOrderWithRelations(int $id): Order|Model
    {
        return Order::with(['user', 'products', 'user.addresses'])->where('user_id', $id)->firstOrFail();
    }

    /**
     * @param OrderStoreRequest $request
     * @return Order|null
     */
    public function createOrder(OrderStoreRequest $request): Order|null
    {
        $unique_order_id = Str::random(15) . now()->format('YmdHis');

        DB::beginTransaction();
        try {
            $order = Order::create([
                'user_id' => Auth::id(),
                'order_id' => $unique_order_id,
                'status' => 'PENDING',
                'products_price' => $request->products_price,
                'products_discount_price' => $request->products_discount_price,
                'shipping_price' => $request->shipping_price,
                'tax_price' => $request->tax_price,
                'total_price' => $request->total_price
            ]);

            foreach ($request->cart_items as $item) {
                $order->products()->attach(
                    $item['product'],
                    [
                        'order_id' => $order->id,
                        'product_id' => $item['product'],
                        'qty' => $item['qty']
                    ]
                );

                $totalQty = $item['qty'];

                // decrement total_quantities from product table based on the qty data inside the cart
                // so that when an order is placed decrease the total quantities value for said product based
                // on the qty value inside the cart
                DB::table('products')->where('id', $item['product'])->decrement('total_quantities', $totalQty);
            }

            DB::commit();
            return $order;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error while creating order: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * @param int $id
     * @return bool
     */
    public function deleteProduct(int $id): bool
    {
        DB::beginTransaction();

        try {
            $order = Order::find($id);
            if (!$order) {
                Log::warning('Order with id ' . $id . ' not found');
                return false;
            }

            $order->products()->detach();
            $order->delete();

            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error while deleting order: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * @param string $status
     * @param int $id
     * @return Order|null
     */
    public function updateOrderStatus(string $status, int $id): Order|null
    {
        try {
            $order = $this->getOrderWithRelations($id)->firstOrFail();
            if (!$order) {
                Log::warning('Order with id ' . $id . ' not found');
                return null;
            }

            $order->is_paid = true;
            $order->paid_at = Carbon::now();
            $order->status = $status;

            $order->save();

            return $order;
        } catch (Exception $e) {
            Log::error('Error while updating order status: ' . $e->getMessage());
            return null;
        }
    }

    public function getPaidOrderCountsByMonth(): array
    {
        $orderCounts = Order::selectRaw('MONTH(created_at) as month, COUNT(*) as count')
            ->where('is_paid', 1)
            ->groupBy('month')
            ->pluck('count', 'month');

        $monthlyCounts = [];

        for ($i = 1; $i <= 12; $i++) {
            $monthlyCounts[] = $orderCounts[$i] ?? 0;
        }

        return $monthlyCounts;
    }



    public function getOrderRevenuesForLastMonth(): array
    {
        return Order::selectRaw('MONTH(created_at) as month, SUM(total_price) as sum')
            ->groupBy('month')
            ->get();
    }

    public function getTotalOrderRevenues(): array
    {
        return Order::selectRaw('SUM(total_price) as sum')
            ->get();
    }

    public function getTotalOrderRevenuesAvg(): array
    {
        return Order::selectRaw('AVG(total_price) as avg')
            ->get();
    }




}
