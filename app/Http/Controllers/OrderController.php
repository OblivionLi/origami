<?php

namespace App\Http\Controllers;

use App\Http\Requests\order\OrderStoreRequest;
use App\Http\Resources\order\OrderIndexAdminResource;
use App\Http\Resources\order\OrderIndexResource;
use App\Http\Resources\order\OrderShowResource;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use PDF;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // return order resource with all relationship data
        return OrderIndexResource::collection(Order::info()->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(OrderStoreRequest $request)
    {
        // create unique order id
        $unique_order_id = Str::random(25);

        // create order
        $order = Order::create([
            'user_id'                   => Auth::id(),
            'order_id'                  => $unique_order_id,
            'status'                    => 'PENDING',
            'products_price'            => $request->products_price,
            'products_discount_price'   => $request->products_discount_price,
            'shipping_price'            => $request->shipping_price,
            'tax_price'                 => $request->tax_price,
            'total_price'               => $request->total_price
        ]);

        // loop through cart items
        foreach ($request->cart_items as $item) {
            // attach data to pivot table between products and orders
            $order->products()->attach(
                $item['product'],
                [
                    'order_id'      => $order->id,
                    'product_id'    => $item['product'],
                    'qty'           => $item['qty']
                ]
            );

            // define totalQty with the quantity value from inside the cart
            $totalQty = $item['qty'];

            // decrement total_quantities from product table based on the qty data inside the cart
            // so that when an order is placed decrease the total quantities value for said product based
            // on the qty value inside the cart
            DB::table('products')->where('id', $item['product'])->decrement('total_quantities', $totalQty);
        }

        // return success message
        $response = ['message' => 'Order create success', 'id'  => $order->order_id];
        return response()->json($response, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // get order by id
        $order = Order::info()->where('order_id', $id)->firstOrFail();

        // if order doesnt exist return error message
        $response = ['message' => 'Order does not exist..'];
        if (!$order) return response()->json($response, 422);

        // return order resource
        return new OrderShowResource($order);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // get order by id
        $order = Order::find($id);

        // if order doesnt exist return error message
        if (!$order) return response()->json(['message' => 'Order does not exist..']);

        // delete the order
        $order->products()->sync([]);
        $order->delete();

        // return success message
        $response = ['message', 'Order delete success'];
        return response()->json($response, 200);
    }

    /**
     * Update Order is_paid
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function updateOrderToPaid($id)
    {
        // get order by id
        $order = Order::info()->find($id);

        // if order doesnt exist return error message
        $response = ['message' => 'Order does not exist..'];
        if (!$order) return response()->json($response, 422);

        // update order data
        $order->is_paid = 1;
        $order->paid_at = Carbon::now();
        $order->status  = 'PAID';

        // save updated order data into database
        $order->save();

        // return order resource
        return new OrderShowResource($order);
    }

    /**
     * Update Order is_delivered
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function updateOrderToDelivered($id)
    {
        // get order by id
        $order = Order::info()->find($id);

        // if order doesnt exist return error message
        $response = ['message' => 'Order does not exist..'];
        if (!$order) return response()->json($response, 422);

        // update order data
        $order->is_delivered = 1;
        $order->delivered_at = Carbon::now();
        $order->status  = 'PAID';

        // save updated order data into database
        $order->save();

        // return order resource
        return new OrderShowResource($order);
    }

    /**
     * Get user's orders
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function getUserOrders()
    {
        // get order where user_id
        $order = Order::info()->where('user_id', Auth::id())->get();

        // if order doesnt exist return error message
        $response = ['message' => 'Order does not exist..'];
        if (!$order) return response()->json($response, 422);

        // return order resource
        return OrderIndexResource::collection($order);
    }

    // Generate PDF
    public function createPDF($id) {
        // get order by id
        $order = Order::info()->where('order_id', $id)->firstOrFail();

        // if order doesnt exist return error message
        $response = ['message' => 'Order does not exist..'];
        if (!$order) return response()->json($response, 422);
  
        // share data to view
        view()->share('order', $order);
        $pdf = PDF::loadView('invoice.orderPDF', $order);
  
        // download PDF file with download method
        return $pdf->download('Your-Order-Invoice.pdf');
        // return $pdf->stream();
    }
}
