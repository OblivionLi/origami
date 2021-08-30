<?php

namespace App\Http\Controllers;

use App\Http\Requests\role\RoleStoreRequest;
use App\Http\Requests\role\RoleUpdateRequest;
use App\Http\Resources\role\RoleIndexResource;
use App\Http\Resources\role\RoleShowResource;
use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // return role resource with all relationship data
        return RoleIndexResource::collection(Role::info()->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(RoleStoreRequest $request)
    {
        // Create the role
        Role::create([
            'name'  => $request->name,
        ]);
        
        // return success message
        $response = ['message' => 'Role create success'];
        return response()->json($response, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // get role by id with relationships
        $role = Role::info()->find($id);

        // if role doesnt exist return error message
        $response = ['message' => 'Role does not exist..'];
        if (!$role) return response()->json($response, 422);

        // return role resource
        return new RoleShowResource($role);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function update(RoleUpdateRequest $request, $id)
    {
        // get role by id
        $role = Role::find($id);

        // if role doesnt exist return error message
        if (!$role) return response()->json(['message' => 'Role does not exist..']);

        // update role data
        $role->name = $request->name;
        $role->is_admin = $request->is_admin;

        // save the new role data
        $role->save();

        // sync relationship permissions data
        $role->permissions()->sync($request->perms);

        // return success message
        $response = ['message', 'Role update success'];
        return response()->json($response, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // get role by id
        $role = Role::find($id);

        // if role doesnt exist return error message
        if (!$role) return response()->json(['message' => 'Role does not exist..']);

        // detach role_permission pivot
        $role->permissions()->detach();

        // delete the role
        $role->delete();

        // return success message
        $response = ['message', 'Role delete success'];
        return response()->json($response, 200);
    }
}
