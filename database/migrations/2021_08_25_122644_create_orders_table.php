<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('order_id')->nullable()->unique();
            $table->string('status');
            $table->decimal('products_price', 8, 2);
            $table->decimal('products_discount_price', 8, 2);
            $table->decimal('shipping_price', 8, 2);
            $table->decimal('tax_price', 8, 2);
            $table->decimal('total_price', 8, 2);
            $table->boolean('is_paid')->default(false);
            $table->boolean('is_delivered')->default(false);
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
}
