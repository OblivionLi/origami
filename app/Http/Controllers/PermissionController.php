<?php

namespace App\Http\Controllers;

use App\Http\Requests\permission\PermissionStoreRequest;
use App\Http\Requests\permission\PermissionUpdateRequest;
use App\Http\Resources\permission\PermissionIndexResource;
use App\Http\Resources\permission\PermissionShowResource;
use App\Models\Permission;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // return role resource with all relationship data
        return PermissionIndexResource::collection(Permission::with('roles')->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(PermissionStoreRequest $request)
    {
        // Create the permission
        Permission::create([
            'name'  => $request->name,
        ]);
        
        // return success message
        $response = ['message' => 'Permission create success'];
        return response()->json($response, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Permission  $permission
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // get permission by id with relationships
        $permission = Permission::find($id);

        // if permission doesnt exist return error message
        $response = ['message' => 'Permission does not exist..'];
        if (!$permission) return response()->json($response, 422);

        // return permission resource
        return new PermissionShowResource($permission);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Permission  $permission
     * @return \Illuminate\Http\Response
     */
    public function update(PermissionUpdateRequest $request, $id)
    {
        // get permission by id
        $permission = Permission::find($id);

        // if permission doesnt exist return error message
        if (!$permission) return response()->json(['message' => 'Permission does not exist..']);

        // update permission data
        $permission->name = $request->name;

        // save the new permission data
        $permission->save();

        // return success message
        $response = ['message', 'Permission update success'];
        return response()->json($response, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Permission  $permission
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // get permission by id
        $permission = Permission::find($id);

        // if permission doesnt exist return error message
        if (!$permission) return response()->json(['message' => 'Permission does not exist..']);

        // detach permission_role pivot
        $permission->roles()->detach();

        // delete the permission
        $permission->delete();

        // return success message
        $response = ['message', 'Permission delete success'];
        return response()->json($response, 200);
    }
}
