<?php

namespace App\Http\Controllers;

use App\Http\Requests\childCat\ChildCategoryStoreRequest;
use App\Http\Requests\childCat\ChildCategoryUpdateRequest;
use App\Http\Resources\childCat\ChildCategoryIndexResource;
use App\Http\Resources\childCat\ChildCategoryShowResource;
use App\Models\ChildCategory;
use Illuminate\Http\Request;

class ChildCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // return child category resource with all relationship data
        return ChildCategoryIndexResource::collection(ChildCategory::info()->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ChildCategoryStoreRequest $request)
    {
        // Create the child category
        ChildCategory::create([
            'name'                  => $request->name,
            'parent_category_id'    => $request->parent_category_id,
            'quantity'              => 0
        ]);
        
        // return success message
        $response = ['message' => 'Child Category create success'];
        return response()->json($response, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ChildCategory  $childCategory
     * @return \Illuminate\Http\Response
     */
    public function show($slug)
    {
        // get child category by id with relationships
        $childCategory = ChildCategory::findBySlug($slug);

        // if child category doesnt exist return error message
        $response = ['message' => 'Child Category does not exist..'];
        if (!$childCategory) return response()->json($response, 422);

        // return child category resource
        return new ChildCategoryShowResource($childCategory);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ChildCategory  $childCategory
     * @return \Illuminate\Http\Response
     */
    public function update(ChildCategoryUpdateRequest $request, $slug)
    {
        // get child category by slug
        $childCategory = ChildCategory::findBySlug($slug);

        // if child category doesnt exist return error message
        if (!$childCategory) return response()->json(['message' => 'Child Category does not exist..']);

        // update child category data
        $childCategory->slug                = null;
        $childCategory->name                = $request->name;
        $childCategory->parent_category_id  = $request->parent_category_id;

        // save the new child category data
        $childCategory->save();

        // return success message
        $response = ['message', 'Child Category update success'];
        return response()->json($response, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ChildCategory  $childCategory
     * @return \Illuminate\Http\Response
     */
    public function destroy($slug)
    {
        // get child category by slug
        $childCategory = ChildCategory::findBySlug($slug);

        // if child category doesnt exist return error message
        if (!$childCategory) return response()->json(['message' => 'Child Category does not exist..']);

        // delete the child category
        $childCategory->delete();

        // return success message
        $response = ['message', 'Child Category delete success'];
        return response()->json($response, 200);
    }
}
