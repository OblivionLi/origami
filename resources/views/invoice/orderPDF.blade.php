<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order PDF Invoice</title>

    <style>
        p {
            color: #388667;
        }

        span, h3 {
            font-size: 1.2rem;
            color: #855C1B;
        }

        table {
            font-family: arial, sans-serif;
            border-collapse: collapse;
            width: 100%;
        }

        td, th {
            border: 1px solid #dddddd;
            text-align: center;
            padding: 8px;
            font-size: 13px;
        }

        tr:nth-child(even) {
            background-color: #dddddd;
        }
    </style>
</head>
<body>
<div class="title">
    <h1>Order Receipt</h1>
</div>

<div class="container">
    <div>
        <h3>Purchased By</h3>
        <hr/>
        <p><span>Name:</span> {{ $user['addresses'][0]['name'] }} {{ $user['addresses'][0]['surname'] }}</p>
        <p><span>Email:</span> {{ $user['email'] }}</p>
        <p><span>Address:</span> {{ $user['addresses'][0]['country'] }}, {{ $user['addresses'][0]['city'] }}
            , {{ $user['addresses'][0]['address'] }}, {{ $user['addresses'][0]['postal_code'] }}</p>
        <p><span>Phone Number:</span> {{ $user['addresses'][0]['phone_number'] }}</p>
        <p><span>Order Time:</span> {{ date("F j, Y / g:i a", strtotime($user['created_at'])); }}</p>
        <p><span>Order Id:</span> {{ $order->order_id }}</p>
    </div>

    <div>
        <h3>Purchased From</h3>
        <hr/>
        <p><span>Organization Name:</span> Yona's Shop</p>
        <p><span>Organization Email:</span> yona@support.com</p>
    </div>

    <div>
        <h3>Order Summary</h3>
        <hr/>
        <table>
            <tr>
                <th>Product Name</th>
                <th>Product Code</th>
                <th>Product Price</th>
                <th>Product Discount</th>
                <th>Product Qty</th>
            </tr>
            @foreach ($order->products as $product)
                <tr>
                    <td>{{ $product->name }}</td>
                    <td>{{ $product->product_code }}</td>
                    <td>{{ $product->price }} &euro;</td>
                    <td>{{ $product->discount ?? '0' }} %</td>
                    <td>{{ $product->pivot->qty }}</td>
                </tr>
            @endforeach
        </table>
        <hr/>
        <table>
            <tr>
                <th>Order Id</th>
                <th>Products Price</th>
                <th>Products Price (Discount)</th>
                <th>Shipping Price</th>
                <th>Tax Price</th>
                <th>Total Price</th>
            </tr>
            <tr>
                <td>{{ $order['order_id'] }}</td>
                <td>{{ $order['products_price'] }} &euro;</td>
                <td>{{ $order['products_discount_price'] }} &euro;</td>
                <td>{{ $order['shipping_price'] }} &euro;</td>
                <td>{{ $order['tax_price'] }} &euro;</td>
                <td>{{ $order['total_price'] }} &euro;</td>
            </tr>
        </table>
    </div>
</div>
</body>
</html>
