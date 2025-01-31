<?php

namespace App\Repositories;

use App\Http\Requests\permission\PermissionStoreRequest;
use App\Http\Requests\permission\PermissionUpdateRequest;
use App\Models\Permission;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PermissionRepository
{

    /**
     * @return Builder
     */
    public function getPermissionWithRelations(): Builder
    {
        return Permission::with('roles');
    }

    /**
     * @param PermissionStoreRequest $request
     * @return bool
     */
    public function createPermission(PermissionStoreRequest $request): bool
    {
        try {
            Permission::create([
                'name' => $request->name
            ]);

            return true;
        } catch (Exception $e) {
            Log::error('Error creating permission: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * @param PermissionUpdateRequest $request
     * @param int $id
     * @return bool
     */
    public function updatePermission(PermissionUpdateRequest $request, int $id): bool
    {
        try {
            $permission = Permission::find($id)->first();
            if (!$permission) {
                Log::error('Permission not found');
                return false;
            }

            $permission->update([
                'name' => $request->name
            ]);

            return true;
        } catch (Exception $e) {
            Log::error('Error updating permission: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * @param int $id
     * @return bool
     */
    public function deletePermission(int $id): bool
    {
        DB::beginTransaction();

        try {
            $permission = Permission::find($id);
            if (!$permission) {
                Log::error('Permission not found');
                return false;
            }

            $permission->roles()->detach();
            $permission->delete();

            DB::commit();
            return true;
        } catch (Exception $e) {
            Log::error('Error deleting permission: ' . $e->getMessage());
            DB::rollBack();
            return false;
        }
    }
}
