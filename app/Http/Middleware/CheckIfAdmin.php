<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckIfAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next): mixed
    {
        if (Auth::check()) {
            foreach(Auth::user()->roles as $role) {
                if ($role->is_admin > 0) {
                    return $next($request);
                } else {
                    return redirect('/')->with('danger', "You don't have permission to continue");
                }
            }
        }

        return redirect('/login');
    }
}
