<?php

namespace App\Repositories;

use App\Models\Role;
use Doctrine\DBAL\Query\QueryException;
use Exception;
use Illuminate\Database\Eloquent\Builder;
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

    public function getRoleWithRelations(): Builder
    {
        return Role::with(['users:name,email', 'permissions:id,name']);
    }
}
