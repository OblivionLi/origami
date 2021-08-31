<?php

namespace App\Http\Controllers;

use App\Http\Requests\product\ProductStoreRequest;
use App\Http\Requests\product\ProductUpdateRequest;
use App\Http\Resources\product\ProductIndexResource;
use App\Http\Resources\product\ProductShowResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // return product resource with all relationship data
        return ProductIndexResource::collection(Product::info()->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ProductStoreRequest $request)
    {
        // Create the product
        $product = Product::create([
            // 'user_id'           => Auth::id(),
            'user_id'               => $request->user_id,
            'parent_category_id'    => $request->parent_category_id,
            'child_category_id'     => $request->child_category_id,
            'name'                  => $request->name,
            'description'           => $request->description,
            'price'                 => $request->price,
            'discount'              => $request->discount,
            'special_offer'         => $request->special_offer,
            'product_code'          => $request->product_code,
            'rating'                => 0,
            'total_reviews'         => 0,
            'total_quantities'      => 0
        ]);

        // return success message
        $response = ['message' => 'Product create success'];
        return response()->json($response, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function show($slug)
    {
        // get product by slug with relationships
        $product = Product::findBySlug($slug);

        // if product doesnt exist return error message
        $response = ['message' => 'Product does not exist..'];
        if (!$product) return response()->json($response, 422);

        // return product resource
        return new ProductShowResource($product);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function update(ProductUpdateRequest $request, $slug)
    {
        // get product by slug
        $product = Product::findBySlug($slug);

        // if product doesnt exist return error message
        if (!$product) return response()->json(['message' => 'Product does not exist..']);

        // update product data
        $product->slug              = null;
        $product->name              = $request->name;
        $product->description       = $request->description;
        $product->price             = $request->price;
        $product->discount          = $request->has('discount') ? ($request->discout > 0 ? $request->discount : null) : null;
        $product->special_offer     = $request->special_offer;
        $product->product_code      = $request->product_code;
        $product->total_quantities  = 0;

        // save the new product data
        $product->save();

        // associate relationship ids
        $product->parentCategory()->associate($request->parent_category_id);
        $product->childCategory()->associate($request->parent_category_id);

        // return success message
        $response = ['message', 'Product update success'];
        return response()->json($response, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\Response
     */
    public function destroy($slug)
    {
        // get product by slug
        $product = Product::findBySlug($slug);

        // if product doesnt exist return error message
        if (!$product) return response()->json(['message' => 'Product does not exist..']);

        // delete the product
        $product->delete();

        // return success message
        $response = ['message', 'Product delete success'];
        return response()->json($response, 200);
    }
}
