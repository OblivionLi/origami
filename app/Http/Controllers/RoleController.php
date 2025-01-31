<?php

namespace App\Http\Controllers;

use App\Http\Requests\role\RoleStoreRequest;
use App\Http\Requests\role\RoleUpdateRequest;
use App\Http\Resources\role\RoleShowResource;
use App\Services\RoleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class RoleController extends Controller
{
    protected RoleService $roleService;

    public function __construct(RoleService $roleService)
    {
        $this->roleService = $roleService;
    }

    /**
     * @return AnonymousResourceCollection
     */
    public function index(): AnonymousResourceCollection
    {
        return $this->roleService->getRolesWithRelations();
    }

    /**
     * @param RoleStoreRequest $request
     * @return JsonResponse
     */
    public function store(RoleStoreRequest $request): JsonResponse
    {
        return $this->roleService->storeRole($request);
    }

    /**
     * @param $id
     * @return RoleShowResource|JsonResponse
     */
    public function show($id): RoleShowResource|JsonResponse
    {
        return $this->roleService->showRole($id);
    }

    /**
     * @param RoleUpdateRequest $request
     * @param $id
     * @return JsonResponse
     */
    public function update(RoleUpdateRequest $request, $id): JsonResponse
    {
        return $this->roleService->updateRole($request, $id);
    }

    /**
     * @param $id
     * @return JsonResponse
     */
    public function destroy($id): JsonResponse
    {
        return $this->roleService->deleteRole($id);
    }
}
