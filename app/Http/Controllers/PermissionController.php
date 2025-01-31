<?php

namespace App\Http\Controllers;

use App\Http\Requests\permission\PermissionStoreRequest;
use App\Http\Requests\permission\PermissionUpdateRequest;
use App\Http\Resources\permission\PermissionShowResource;
use App\Services\PermissionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PermissionController extends Controller
{
    protected PermissionService $permissionService;

    public function __construct(PermissionService $permissionService)
    {
        $this->permissionService = $permissionService;
    }

    /**
     * @return AnonymousResourceCollection
     */
    public function index(): AnonymousResourceCollection
    {
        return $this->permissionService->getPermissionsWithRelations();
    }

    /**
     * @param PermissionStoreRequest $request
     * @return JsonResponse
     */
    public function store(PermissionStoreRequest $request): JsonResponse
    {
        return $this->permissionService->savePermission($request);
    }

    /**
     * @param $id
     * @return PermissionShowResource|JsonResponse
     */
    public function show($id): PermissionShowResource|JsonResponse
    {
        return $this->permissionService->showPermission($id);
    }

    /**
     * @param PermissionUpdateRequest $request
     * @param $id
     * @return JsonResponse
     */
    public function update(PermissionUpdateRequest $request, $id): JsonResponse
    {
        return $this->permissionService->updatePermission($request, $id);
    }

    /**
     * @param $id
     * @return JsonResponse
     */
    public function destroy($id): JsonResponse
    {
        return $this->permissionService->deletePermission($id);
    }
}
