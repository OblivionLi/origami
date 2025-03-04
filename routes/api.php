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

//    Route::get('products/accessories', 'getProductByAccessories');
//    Route::get('products/origami', 'getProductByOrigami');
//    Route::get('products/special-offers', 'getProductBySpecialOffers');
});

//Route::controller(ReviewController::class)->group(function () {
//    Route::get('products/{product}/reviews', 'indexWithPagination');
//});

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
        Route::get('admin/dashboard/order-charts', [OrderController::class, 'orderCharts']);

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
            Route::get('admin/parent-categories', 'index');
            Route::post('admin/parent-categories', 'store');
            Route::patch('admin/parent-categories/{category}', 'update');
            Route::delete('admin/parent-categories/{category}', 'destroy');

        });

        // Child Category Management
        Route::controller(ChildCategoryController::class)->group(function () {
            Route::get('admin/child-categories', 'index');
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
            Route::patch('admin/products/{product}', 'update');
            Route::delete('admin/products/{product}', 'destroy');
        });

        // Product Image Management
        Route::controller(ProductImageController::class)->group(function () {
            Route::post('admin/products/{product}/image', 'store');
            Route::patch('admin/product-images/{imageId}', 'update');
            Route::delete('admin/product-images/{imageId}', 'destroy');
        });

        // Order Management
        Route::controller(OrderController::class)->group(function () {
            Route::get('admin/orders', 'index');
            Route::patch('admin/orders/{order}/deliver', 'updateOrderToDelivered');
            Route::delete('admin/orders/{order}', 'destroy');
        });
    });
});

//// Public routes        ################################################## no need for admin perms or login
//Route::post('register', [AuthController::class, 'register']);
//Route::post('login', [AuthController::class, 'login'])->name('login');
//Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
//Route::patch('reset-password/{email}', [AuthController::class, 'resetPassword']);
//Route::get('reset-password/{token}', [AuthController::class, 'getToken']);

//
//# Product routes
//Route::get('showcase-products', [ProductController::class, 'getShowcaseProducts']);
//Route::get('products/{product}', [ProductController::class, 'show']);
//Route::get('reviews/product/{product}', [ReviewController::class, 'indexWithPagination']);
//
//Route::get('config/stripe', [CheckoutController::class, 'secretKey']);
//Route::get('config/PKstripe', [CheckoutController::class, 'publicKey']);
//Route::post('payment_intents', [CheckoutController::class, 'createPayIntent']);
//
//Route::get('accessories', [ProductController::class, 'getProductByAccessories']);
//Route::get('origami', [ProductController::class, 'getProductByOrigami']);
//Route::get('special-offers', [ProductController::class, 'getProductBySpecialOffers']);
//
//Route::get('/order/pdf/{order}', [OrderController::class, 'createPDF']);
//
//// Public routes        ################################################## no need for admin perms; login needed !
//Route::group(['middleware' => 'auth:api'], function () {
//    # User routes
//    Route::get('logout', [AuthController::class, 'logout']);
//    Route::patch('update-credentials/{id}', [AuthController::class, 'update']);
//    Route::delete('delete/{id}', [AuthController::class, 'delete_user']);
//    Route::get('users/{user}', [UserController::class, 'show']);
//
//    # Review routes
//    Route::post('reviews/{review}', [ReviewController::class, 'store']);
//
//    # Order routes
//    Route::post('order', [OrderController::class, 'store']);
//    Route::get('order/{order}', [OrderController::class, 'show']);
//    Route::patch('order/{order}/pay', [OrderController::class, 'updateOrderToPaid']);
//    Route::get('user-order', [OrderController::class, 'getUserOrders']);
//
//    # Address routes
//    Route::get('address', [AddressController::class, 'index']);
//    Route::post('address', [AddressController::class, 'store']);
//    Route::get('address/{address}', [AddressController::class, 'show']);
//    Route::patch('address/{address}', [AddressController::class, 'update']);
//    Route::delete('address/{address}', [AddressController::class, 'destroy']);
//
//    // Private routes   ################################################## admin perms & login needed !
//    Route::group(['middleware' => 'isAdmin'], function () {
//        # Dashboard charts
//        Route::get('orderCharts', [OrderController::class, 'orderCharts']);
//
//        # User routes
//        Route::get('users', [UserController::class, 'index']);
//        Route::patch('users/{user}', [UserController::class, 'update']);
//        Route::delete('users/{user}', [UserController::class, 'destroy']);
//
//        # Role routes
//        Route::get('roles', [RoleController::class, 'index']);
//        Route::post('roles', [RoleController::class, 'store']);
//        Route::get('roles/{role}', [RoleController::class, 'show']);
//        Route::patch('roles/{role}', [RoleController::class, 'update']);
//        Route::delete('roles/{role}', [RoleController::class, 'destroy']);
//
//        # Permission routes
//        Route::get('permissions', [PermissionController::class, 'index']);
//        Route::post('permissions', [PermissionController::class, 'store']);
//        Route::get('permissions/{permission}', [PermissionController::class, 'show']);
//        Route::patch('permissions/{permission}', [PermissionController::class, 'update']);
//        Route::delete('permissions/{permission}', [PermissionController::class, 'destroy']);
//
//        # Parent Category routes
//        Route::get('parent-categories', [ParentCategoryController::class, 'index']);
//        Route::post('parent-categories', [ParentCategoryController::class, 'store']);
//        Route::get('parent-categories/{parentCategory}', [ParentCategoryController::class, 'show']);
//        Route::patch('parent-categories/{parentCategory}', [ParentCategoryController::class, 'update']);
//        Route::delete('parent-categories/{parentCategory}', [ParentCategoryController::class, 'destroy']);
//
//        # Child Category routes
//        Route::get('child-categories', [ChildCategoryController::class, 'index']);
//        Route::post('child-categories', [ChildCategoryController::class, 'store']);
//        Route::get('child-categories/{childCategory}', [ChildCategoryController::class, 'show']);
//        Route::patch('child-categories/{childCategory}', [ChildCategoryController::class, 'update']);
//        Route::delete('child-categories/{childCategory}', [ChildCategoryController::class, 'destroy']);
//
//        # Product routes
//        Route::get('products', [ProductController::class, 'index']);
//        Route::post('products', [ProductController::class, 'store']);
//        Route::patch('products/{product}', [ProductController::class, 'update']);
//        Route::delete('products/{product}', [ProductController::class, 'destroy']);
//
//        # Product Images routes
//        Route::post('productImage/{productId}', [ProductImageController::class, 'store']);
//        Route::post('RproductImage/{imageId}', [ProductImageController::class, 'update']);
//        Route::delete('productImage/{imageId}', [ProductImageController::class, 'destroy']);
//
//        # Review routes
//        Route::get('reviews', [ReviewController::class, 'index']);
//        // Route::get('reviews', [ReviewController::class, 'indexWithPagination']);
//        Route::get('reviews/{review}', [ReviewController::class, 'show']);
//        Route::patch('reviews/{review}', [ReviewController::class, 'update']);
//        Route::delete('reviews/{review}', [ReviewController::class, 'destroy']);
//
//        # Order routes
//        Route::get('orders', [OrderController::class, 'index']);
//        Route::patch('orders/{order}/delivered', [OrderController::class, 'updateOrderToDelivered']);
//        Route::delete('orders/{order}', [OrderController::class, 'destroy']);
//    });
//});
