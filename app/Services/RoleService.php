<?php

namespace App\Services;

use App\Http\Requests\role\RoleStoreRequest;
use App\Http\Requests\role\RoleUpdateRequest;
use App\Http\Resources\role\RoleIndexResource;
use App\Http\Resources\role\RoleShowResource;
use App\Repositories\RoleRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class RoleService
{
    protected RoleRepository $roleRepository;

    public function __construct(RoleRepository $roleRepository)
    {
        $this->roleRepository = $roleRepository;
    }

    /**
     * @return AnonymousResourceCollection
     */
    public function getRolesWithRelations(): AnonymousResourceCollection
    {
        return RoleIndexResource::collection($this->roleRepository->getRoleWithRelations()->get());

    }

    /**
     * @param RoleStoreRequest $request
     * @return JsonResponse
     */
    public function storeRole(RoleStoreRequest $request): JsonResponse
    {
        $tryToCreateRole = $this->roleRepository->createRole($request->name);
        if (!$tryToCreateRole) {
            return response()->json(['message' => 'Role store failed'], 500);
        }

        return response()->json(['message' => 'Role created'], 200);
    }

    /**
     * @param int $id
     * @return RoleShowResource|JsonResponse
     */
    public function showRole(int $id): RoleShowResource|JsonResponse
    {
        $role = $this->roleRepository->getRoleWithRelations($id);
        if (!$role) {
            return response()->json(['message' => 'Role not found'], 404);
        }

        return new RoleShowResource($role);
    }

    /**
     * @param RoleUpdateRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function updateRole(RoleUpdateRequest $request, int $id): JsonResponse
    {
        // TODO:: check $request->perms ????
        $tryToUpdateRole = $this->roleRepository->updateRole($request, $id);
        if (!$tryToUpdateRole) {
            return response()->json(['message' => 'Role update failed'], 500);
        }
        return response()->json(['message' => 'Role updated'], 200);
    }

    /**
     * @param int $id
     * @return JsonResponse
     */
    public function deleteRole(int $id): JsonResponse
    {
        $tryToDeleteRole = $this->roleRepository->destroyRole($id);
        if (!$tryToDeleteRole) {
            return response()->json(['message' => 'Role delete failed'], 500);
        }
        return response()->json(['message' => 'Role deleted'], 200);
    }
}
