<?php

namespace App\Services;

use App\Http\Requests\permission\PermissionStoreRequest;
use App\Http\Requests\permission\PermissionUpdateRequest;
use App\Http\Resources\permission\PermissionIndexResource;
use App\Http\Resources\permission\PermissionShowResource;
use App\Models\Permission;
use App\Repositories\PermissionRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PermissionService
{
    protected PermissionRepository $permissionRepository;

    public function __construct(PermissionRepository $permissionRepository)
    {
        $this->permissionRepository = $permissionRepository;
    }

    /**
     * @return AnonymousResourceCollection
     */
    public function getPermissionsWithRelations(): AnonymousResourceCollection
    {
        return PermissionIndexResource::collection($this->permissionRepository->getPermissionWithRelations()->get());
    }

    /**
     * @param PermissionStoreRequest $request
     * @return JsonResponse
     */
    public function savePermission(PermissionStoreRequest $request): JsonResponse
    {
        $tryToCreatePermission = $this->permissionRepository->createPermission($request);
        if (!$tryToCreatePermission) {
            return response()->json(['message' => 'Permission failed to create'], 500);
        }

        return response()->json(['message' => 'Permission created'], 201);
    }

    /**
     * @param int $id
     * @return PermissionShowResource|JsonResponse
     */
    public function showPermission(int $id): PermissionShowResource|JsonResponse
    {
        $permission = Permission::find($id)->first();
        if (!$permission) {
            return response()->json(['message' => 'Permission not found'], 404);
        }

        return new PermissionShowResource($permission);
    }

    /**
     * @param PermissionUpdateRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function updatePermission(PermissionUpdateRequest $request, int $id): JsonResponse
    {
        $tryToUpdatePermission = $this->permissionRepository->updatePermission($request, $id);
        if (!$tryToUpdatePermission) {
            return response()->json(['message' => 'Permission failed to update'], 500);
        }

        return response()->json(['message' => 'Permission updated'], 201);
    }

    /**
     * @param int $id
     * @return JsonResponse
     */
    public function deletePermission(int $id): JsonResponse
    {
        $tryToDeletePermission = $this->permissionRepository->deletePermission($id);
        if (!$tryToDeletePermission) {
            return response()->json(['message' => 'Permission failed to delete'], 500);
        }

        return response()->json(['message' => 'Permission deleted'], 201);
    }
}
