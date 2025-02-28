<?php

namespace App\Services;

use App\Http\Requests\role\RoleStoreRequest;
use App\Http\Requests\role\RoleUpdateRequest;
use App\Http\Resources\role\RoleIndexResource;
use App\Http\Resources\role\RoleShowResource;
use App\Repositories\RoleRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

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
        return RoleIndexResource::collection($this->roleRepository->getRoleWithRelations(null)->get());

    }

    /**
     * @param RoleStoreRequest $request
     * @return JsonResponse
     */
    public function storeRole(RoleStoreRequest $request): JsonResponse
    {
        $tryToCreateRole = $this->roleRepository->createRole($request->validated());
        if (!$tryToCreateRole) {
            return response()->json(['message' => 'Failed to create role.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json(['message' => 'Role created successfully.'], Response::HTTP_CREATED);
    }

    /**
     * @param int $id
     * @return RoleShowResource|JsonResponse
     */
    public function showRole(int $id): RoleShowResource|JsonResponse
    {
        $role = $this->roleRepository->getRoleWithRelations($id);
        if (!$role) {
            return response()->json(['message' => 'Role not found.'], Response::HTTP_NOT_FOUND);
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
        $tryToUpdateRole = $this->roleRepository->updateRole($request->validated(), $id);
        if (!$tryToUpdateRole) {
            return response()->json(['message' => 'Failed to update role.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
        return response()->json(['message' => 'Role updated successfully.'], Response::HTTP_OK);
    }

    /**
     * @param int $id
     * @return JsonResponse
     */
    public function destroyRole(int $id): JsonResponse
    {
        $tryToDeleteRole = $this->roleRepository->deleteRole($id);
        if (!$tryToDeleteRole) {
            return response()->json(['message' => 'Failed to delete role.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
        return response()->json(['message' => 'Role deleted successfully.'], Response::HTTP_OK);
    }
}
