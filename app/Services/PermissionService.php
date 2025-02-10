<?php

namespace App\Services;

use App\Http\Requests\permission\PermissionStoreRequest;
use App\Http\Requests\permission\PermissionUpdateRequest;
use App\Http\Resources\permission\PermissionIndexResource;
use App\Http\Resources\permission\PermissionShowResource;
use App\Repositories\PermissionRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\Response;

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
    public function storePermission(PermissionStoreRequest $request): JsonResponse
    {
        $tryToCreatePermission = $this->permissionRepository->createPermission($request->validated());
        if (!$tryToCreatePermission) {
            return response()->json(['message' => 'Failed to create permission.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json(['message' => 'Permission created successfully.'], Response::HTTP_CREATED);
    }

    /**
     * @param int $id
     * @return PermissionShowResource|JsonResponse
     */
    public function showPermission(int $id): PermissionShowResource|JsonResponse
    {
        $permission = $this->permissionRepository->getPermissionById($id);
        if (!$permission) {
            return response()->json(['message' => 'Permission not found.'], Response::HTTP_NOT_FOUND);
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
        $tryToUpdatePermission = $this->permissionRepository->updatePermission($request->validated(), $id);
        if (!$tryToUpdatePermission) {
            return response()->json(['message' => 'Failed to update permission.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        return response()->json(['message' => 'Permission updated successfully.'], Response::HTTP_OK);
    }

    /**
     * @param int $id
     * @return JsonResponse
     */
    public function destroyPermission(int $id): JsonResponse
    {
        $tryToDeletePermission = $this->permissionRepository->deletePermission($id);
        if (!$tryToDeletePermission) {
            return response()->json(['message' => 'Failed to delete permission.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return response()->json(['message' => 'Permission deleted successfully.'], Response::HTTP_OK);
    }
}
