<?php

namespace App\Http\Controllers;

use App\Http\Requests\checkout\CheckoutRequest;
use Illuminate\Http\JsonResponse;
use Stripe\Exception\ApiErrorException;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class CheckoutController extends Controller
{
    /**
     * @return JsonResponse
     */
    public function secretKey(): JsonResponse
    {
        return response()->json(config('stripe.STRIPE_SECRET'), 200);
    }

    /**
     * @return JsonResponse
     */
    public function publicKey(): JsonResponse
    {
        return response()->json(config('stripe.STRIPE_KEY'), 200);
    }

    /**
     * @param CheckoutRequest $request
     * @return JsonResponse
     * @throws ApiErrorException
     */
    public function createPayIntent(CheckoutRequest $request): JsonResponse
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));

        $payment_intent = PaymentIntent::create([
            'description' => config('stripe.STRIPE_DESCRIPTION'),
            'amount' => $request->amount * 100,
            'currency' => 'eur',
            'payment_method_types' => ['card'],
        ]);

        $intent = $payment_intent->client_secret;

        return response()->json($intent);
    }
}
