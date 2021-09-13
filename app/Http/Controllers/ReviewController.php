<?php

namespace App\Http\Controllers;

use App\Http\Requests\review\ReviewStoreRequest;
use App\Http\Requests\review\ReviewUpdateRequest;
use App\Http\Resources\review\ReviewIndexResource;
use App\Http\Resources\review\ReviewIndexWithPaginationResource;
use App\Http\Resources\review\ReviewShowResource;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Error;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // return review resource with all relationship data
        return ReviewIndexResource::collection(Review::info()->get());
    }

    /**
     * Display a listing of the resource with pagination.
     * 
     */
    public function indexWithPagination($id)
    {
        // return review resource with all relationship data
        return ReviewIndexWithPaginationResource::collection(Review::with('product')->where('product_id', $id)->paginate(1));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ReviewStoreRequest $request, $slug)
    {
        // find product by product_id
        $product = Product::findBySlug($slug);

        // if product doesnt exist return error message
        if ($product) {
            // get review where product_id is the same as request->product_id
            // and user_id is the same as the logged in user id
            $existingReview = Review::where([
                ['product_id',  '=', $product->id],
                ['user_id',     '=', $request->user_id]
            ])->get();

            // check if existingReview already exist
            // if not then send an error message
            if ($existingReview->count() < 1) {
                // create review
                Review::create([
                    'product_id'        => $product->id,
                    'user_id'           => $request->user_id,
                    'user_name'         => $request->username,
                    'rating'            => $request->rating,
                    'user_comment'      => $request->comment 
                ]);

                // get collection of reviews where product_id is the same as request->product_id
                $reviews = Review::where('product_id', $product->id)->get();
        
                // update product overall total_reviews and rating columns data
                $product->total_reviews = $reviews->count();
                $product->rating        = $reviews->avg('rating');
        
                // save product data into database
                $product->save();
            } else { 
                // return error message
                throw new Error('You reviewed this product already. Only one review per customer is allowed!', 1);
            }
        }

        // return success message
        $response = ['message', 'Review create success'];
        return response()->json($response, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Review  $review
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // get review by id
        $review = Review::find($id);

        // if review doesnt exist return error message
        $response = ['message' => 'Review does not exist..'];
        if (!$review) return response()->json($response, 422);

        // return review resource
        return new ReviewShowResource($review);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Review  $review
     * @return \Illuminate\Http\Response
     */
    public function update(ReviewUpdateRequest $request, $id)
    {
        // find review by id
        $review = Review::find($id);

        // if review doesnt exist return error message
        if (!$review) return response()->json(['message' => 'Review does not exist..']);

        // get logged in user id
        $user_id = Auth::id();

        // if no user is logged in return error message
        if (!$user_id) return response()->json(['message' => 'Unable to find logged in user..']);

        // find user by logged in id
        $user = User::find($user_id);

        // if user doesnt exist return error message
        if (!$user) return response()->json(['message' => 'User does not exist..']);

        // update review data
        $review->admin_name     = $user->name;
        $review->user_comment   = $request->user_comment;
        $review->admin_comment  = $request->admin_comment;

        // save the new review data
        $review->save();

        // return success message
        $response = ['message', 'Review update success'];
        return response()->json($response, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Review  $review
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // find review by id
        $review = Review::find($id);

        // if review doesnt exist return error message
        if (!$review) return response()->json(['message' => 'Review does not exist..']);

        // delete review
        $review->delete();

        // return success message
        $response = ['message', 'Review delete success'];
        return response()->json($response, 200);
    }
}
