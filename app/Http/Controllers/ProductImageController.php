<?php

namespace App\Http\Controllers;

use App\Http\Requests\productImg\ProductImageUpdateRequest;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class ProductImageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // find images of the current product
        $images = ProductImage::where('product_id', $request->product_id)->get();

        // limit adding a new image if the product already has 5 images
        if ($images->count() < 5) {
            // check if request has file
            if ($request->hasFile('images')) {
                // get image original name and add currect time for an overall unique name
                $imgFileName = time() . '_' . $request->images->getClientOriginalName();

                // create image
                ProductImage::create([
                    'product_id'    => $request->product_id,
                    'name'          => $imgFileName,
                    'path'          => $request->images->storeAs('productImages', $imgFileName, 'public')
                ]);

            // return warning message
            } else {
                return response()->json(['warning' => 'The limit (5) of images per product reached..']);
            }
        }

        // return success message
        $response = ['message' => 'Image create success'];
        return response()->json($response, 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ProductImage  $productImage
     * @return \Illuminate\Http\Response
     */
    public function update(ProductImageUpdateRequest $request)
    {
        // if request has no files return error message
        if (!$request->hasFile('images')) return response()->json(['message' => 'Request has no file to process..']);

        // get image original name and add currect time for an overall unique name
        $imgFileName = time() . '_' . $request->images->getClientOriginalName();

        // replace image
        ProductImage::create([
            'product_id'    => $request->product_id,
            'name'          => $imgFileName,
            'path'          => $request->images->storeAs('productImages', $imgFileName, 'public')
        ]);

        // find the current image to be replaced
        $currentImage = ProductImage::find($request->image_id);
        // get the current image to be replaced path
        $currentImagePath = public_path('/storage/' . $currentImage->path);

        // check if current image path exist in storage
        if (File::exists($currentImagePath)) {
            // delete image from storage
            File::delete($currentImagePath);
            // delete image from database
            $currentImage->delete();
        }

        // return success message
        $response = ['message' => 'Image replace success'];
        return response()->json($response, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ProductImage  $productImage
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // find image by id
        $image = ProductImage::find($id);

        // if image doesnt exist return error message
        if (!$image) return response()->json(['message' => 'Image does not exist..']);

        // get image path
        $imagePath = public_path('/storage/' . $image->path);

        // check if image path exist
        if (File::exists($imagePath)) {
            // delete image from storage
            File::delete($imagePath);
            // delete image from database
            $image->delete();
        }

        // return success message
        $response = ['message', 'Image delete success'];
        return response()->json($response, 200);
    }
}
