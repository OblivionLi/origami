<?php

namespace App\Repositories;

use App\Http\Requests\role\RoleUpdateRequest;
use App\Models\Role;
use Doctrine\DBAL\Query\QueryException;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RoleRepository
{
    /**
     * @param string $name
     * @return Role | null
     * @throws Exception
     */
    public function getOrCreateRole(string $name): ?Role
    {
        try {
            return Role::firstOrCreate(
                ['name' => $name],
                [
                    'name' => $name,
                    'is_admin' => false
                ]
            );
        } catch (QueryException $e) {
            DB::rollBack();
            Log::error("Database error creating role: " . $e->getMessage());
            return null;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error("Error creating role: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * @param string $name
     * @return bool
     */
    public function createRole(string $name): bool
    {
        try {
            Role::create([
                'name' => $name,
                'is_admin' => 0
            ]);

            return true;
        } catch (Exception $e) {
            Log::error("Database error creating role: " . $e->getMessage());
            return false;
        }
    }

    /**
     * @param int|null $id
     * @return Builder|Collection
     */
    public function getRoleWithRelations(?int $id = null): Builder|Collection
    {
        if ($id) {
            return Role::with(['users:name,email', 'permissions:id,name'])->find($id);
        }
        return Role::with(['users:name,email', 'permissions:id,name'])->get();
    }

    /**
     * @param RoleUpdateRequest $request
     * @param int $id
     * @return bool
     */
    public function updateRole(RoleUpdateRequest $request, int $id): bool
    {
        DB::beginTransaction();
        try {
            $role = Role::find($id);
            if (!$role) {
                return false;
            }

            $role->name = $request->name;
            $role->is_admin = $request->is_admin;

            $role->save();

//            $role->permissions()->sync($request->perms); // ??

            DB::commit();
            return true;
        } catch (Exception $e) {
            Log::error("Database error updating role: " . $e->getMessage());
            DB::rollBack();
            return false;
        }
    }

    /**
     * @param int $id
     * @return bool
     */
    public function destroyRole(int $id): bool
    {
        DB::beginTransaction();

        try {
            $role = Role::find($id);
            if (!$role) {
                return false;
            }

            $role->permissions()->detach();
            $role->users()->detach();

            $role->delete();

            return true;
        } catch (Exception $e) {
            Log::error("Database error deleting role: " . $e->getMessage());
            return false;
        }
    }
}
