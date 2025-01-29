<?php

namespace App\Services;

use App\Repositories\RoleRepository;

class RoleService
{
    protected RoleRepository $roleRepository;

    public function __construct(RoleRepository $roleRepository)
    {
        $this->roleRepository = $roleRepository;
    }


}
