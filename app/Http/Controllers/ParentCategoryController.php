<?php

namespace App\Http\Controllers;

use App\Http\Requests\parentCat\ParentCategoryStoreRequest;
use App\Http\Requests\parentCat\ParentCategoryUpdateRequest;
use App\Http\Resources\parentCat\ParentCategoryIndexResource;
use App\Http\Resources\parentCat\ParentCategoryShowResource;
use App\Models\ParentCategory;
use Illuminate\Http\Request;

class ParentCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // return parent category resource with all relationship data
        return ParentCategoryIndexResource::collection(ParentCategory::info()->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(ParentCategoryStoreRequest $request)
    {
        // Create the parent category
        ParentCategory::create([
            'name'  => $request->name,
        ]);
        
        // return success message
        $response = ['message' => 'Parent Category create success'];
        return response()->json($response, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ParentCategory  $parentCategory
     * @return \Illuminate\Http\Response
     */
    public function show($slug)
    {
        // get parent category by slug with relationships
        $parentCategory = ParentCategory::findBySlug($slug);

        // if parent category doesnt exist return error message
        $response = ['message' => 'ParentCategory does not exist..'];
        if (!$parentCategory) return response()->json($response, 422);

        // return parent category resource
        return new ParentCategoryShowResource($parentCategory);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ParentCategory  $parentCategory
     * @return \Illuminate\Http\Response
     */
    public function update(ParentCategoryUpdateRequest $request, $slug)
    {
        // get parent category by slug
        $parentCategory = ParentCategory::findBySlug($slug);

        // if parent category doesnt exist return error message
        if (!$parentCategory) return response()->json(['message' => 'Parent Category does not exist..']);

        // update parent category data
        $parentCategory->slug = null;
        $parentCategory->name = $request->name;

        // save the new parent category data
        $parentCategory->save();

        // return success message
        $response = ['message', 'Parent Category update success'];
        return response()->json($response, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ParentCategory  $parentCategory
     * @return \Illuminate\Http\Response
     */
    public function destroy($slug)
    {
        // get parent category by slug
        $parentCategory = ParentCategory::findBySlug($slug);

        // if parent category doesnt exist return error message
        if (!$parentCategory) return response()->json(['message' => 'Parent Category does not exist..']);

        // delete the parent category
        $parentCategory->delete();

        // return success message
        $response = ['message', 'Parent Category delete success'];
        return response()->json($response, 200);
    }
}
