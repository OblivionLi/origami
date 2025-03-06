<?php

use App\Http\Controllers\AddressController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ChildCategoryController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ParentCategoryController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductImageController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;


// Public Routes (No Authentication or Authorization Required)
Route::controller(AuthController::class)->group(function () {
    Route::post('register', 'register');
    Route::post('login', 'login')->name('login');
    Route::post('forgot-password', 'forgotPassword');
    Route::get('reset-password/{token}', 'getPasswordResetToken')->name('password.reset');
    Route::patch('reset-password', 'resetPassword');
});

Route::controller(ProductController::class)->group(function () {
    Route::get('showcase-products', 'getShowcaseProducts');
});

Route::controller(CheckoutController::class)->group(function () {
    Route::get('config/stripe', 'secretKey');
    Route::get('config/stripe/public-key', 'publicKey');
    Route::post('payment-intents', 'createPayIntent');
});

Route::get('orders/{order}/pdf', [OrderController::class, 'createPDF']);

// Authenticated Routes (Login Required)
Route::middleware('auth:api')->group(function () {
    // User Routes
    Route::controller(AuthController::class)->group(function () {
        Route::get('logout', 'logout');
        Route::patch('users/update-credentials/{id}', 'updateMe');
        Route::delete('users/me/{email}', 'deleteMe');
    });

    Route::controller(UserController::class)->group(function () {
        Route::get('users/{user}', 'show');
        Route::get('users/{user}/address', 'showUserAddress');
    });

    // Checkout Routes
    Route::controller(CheckoutController::class)->group(function () {
        Route::post('payment_intents', 'createPayIntent');
    });


    // Review Routes
    Route::controller(ReviewController::class)->group(function () {
        Route::post('products/{product}/reviews', 'store');
        Route::get('products/{product}/reviews', 'index');
    });

    // Product Routes
    Route::controller(ProductController::class)->group(function () {
        Route::get('products/accessories/{childCategoryId}', 'getProductByAccessories');
        Route::get('products/origami/{childCategoryId}', 'getProductByOrigami');
        Route::get('products/special-offers', 'getProductBySpecialOffers');
        Route::get('products/{slug}', 'show');
    });

    // Order Routes
    Route::controller(OrderController::class)->group(function () {
        Route::post('orders', 'store');
        Route::get('orders/me', 'getUserOrders');
        Route::get('orders/{order}', 'show');
        Route::patch('orders/{order}/pay', 'updateOrderStatus');
        Route::patch('orders/{order}/deliver', 'updateOrderStatus');
    });

    // Address Routes
    Route::controller(AddressController::class)->group(function () {
        Route::post('address', 'store');
        Route::get('address/{address}', 'show');
        Route::get('address/{address}/order', 'showOrderAddress');
        Route::get('address', 'index');
        Route::patch('address/{address}', 'update');
        Route::delete('address/{address}', 'delete');
    });

    // Admin Routes (Admin Role Required)
    Route::middleware('isAdmin')->group(function () {
        // Dashboard
        Route::get('admin/order-charts', [OrderController::class, 'orderCharts']);

        // User Management
        Route::controller(UserController::class)->group(function () {
            Route::get('admin/users/{user}/permissions', 'getUserRolesPermissions');
            Route::get('admin/users', 'indexAdmin');
            Route::patch('admin/users/{user}', 'update');
        });

        // Role Management
        Route::controller(RoleController::class)->group(function () {
            Route::get('admin/roles', 'index');
            Route::post('admin/roles', 'store');
            Route::patch('admin/roles/{role}', 'update');
            Route::delete('admin/roles/{role}', 'destroy');
        });

        // Permission Management
        Route::controller(PermissionController::class)->group(function () {
            Route::get('admin/permissions', 'index');
            Route::post('admin/permissions', 'store');
            Route::patch('admin/permissions/{permission}', 'update');
            Route::delete('admin/permissions/{permission}', 'destroy');
        });

        // Parent Category Management
        Route::controller(ParentCategoryController::class)->group(function () {
            Route::get('admin/parent-categories', 'indexAdmin');
            Route::post('admin/parent-categories', 'store');
            Route::patch('admin/parent-categories/{category}', 'update');
            Route::delete('admin/parent-categories/{category}', 'destroy');

        });

        // Child Category Management
        Route::controller(ChildCategoryController::class)->group(function () {
            Route::get('admin/child-categories', 'indexAdmin');
            Route::post('admin/child-categories', 'store');
            Route::patch('admin/child-categories/{category}', 'update');
            Route::delete('admin/child-categories/{category}', 'destroy');

        });

        // Review Management
        Route::controller(ReviewController::class)->group(function () {
            Route::get('admin/reviews', 'indexAdmin');
            Route::patch('admin/reviews/{review}', 'update');
            Route::delete('admin/reviews/{review}', 'destroy');
        });

        // Product Management
        Route::controller(ProductController::class)->group(function () {
            Route::get('admin/products', 'indexAdmin');
            Route::post('admin/products', 'store');
            Route::patch('admin/products/{product}', 'update');
            Route::delete('admin/products/{product}', 'destroy');
        });

        // Product Image Management
        Route::controller(ProductImageController::class)->group(function () {
            Route::post('admin/products/{product}/image', 'store');
            Route::post('admin/products/image/{image}/replace', 'update');
            Route::delete('admin/products/image/{image}', 'destroy');
        });

        // Order Management
        Route::controller(OrderController::class)->group(function () {
            Route::get('admin/orders', 'indexAdmin');
            Route::patch('admin/orders/{order}/deliver', 'updateOrderToDelivered');
            Route::delete('admin/orders/{order}', 'destroy');
        });
    });
});

