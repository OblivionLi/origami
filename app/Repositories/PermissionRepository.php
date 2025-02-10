<?php

namespace App\Repositories;

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
     * @param array $requestData
     * @return bool
     */
    public function createPermission(array $requestData): bool
    {
        try {
            Permission::create([
                'name' => $requestData['name'],
            ]);

            return true;
        } catch (Exception $e) {
            Log::error('Error creating permission: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * @param array $requestData
     * @param int $id
     * @return Permission|null
     */
    public function updatePermission(array $requestData, int $id): ?Permission
    {
        try {
            $permission = Permission::find($id)->first();
            if (!$permission) {
                return null;
            }

            $permission->update([
                'name' => $requestData['name'],
            ]);

            return $permission;
        } catch (Exception $e) {
            Log::error('Error updating permission: ' . $e->getMessage());
            return null;
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

    /**
     * @param int $id
     * @return Permission|null
     */
    public function getPermissionById(int $id): ?Permission
    {
        return Permission::find($id)->first();
    }
}
