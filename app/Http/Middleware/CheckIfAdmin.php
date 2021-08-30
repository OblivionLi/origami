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
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // check if user is logged in
        if (Auth::check()) {

            // loop through user's roles
            foreach(Auth::user()->roles as $role) {

                // check if user role has admin permissions
                if ($role->is_admin > 0) {

                    // continue if true
                    return $next($request);

                // else redirect to '/' with warning
                } else {
                    return redirect('/')->with('danger', "You don't have permission to continue");
                }
            }
        }

        // redirect to login if user is not logged in
        return redirect('/login');
    }
}
