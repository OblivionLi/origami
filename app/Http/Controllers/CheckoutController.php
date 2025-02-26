<?php

namespace App\Http\Controllers;

use App\Http\Requests\checkout\CheckoutRequest;
use App\Models\Address;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\ApiErrorException;
use Stripe\PaymentIntent;
use Stripe\Stripe;
use Symfony\Component\HttpFoundation\Response;

class CheckoutController extends Controller
{
    /**
     * @return JsonResponse
     */
    public function secretKey(): JsonResponse
    {
        return response()->json(config('stripe.STRIPE_SECRET'), Response::HTTP_OK);
    }

    /**
     * @return JsonResponse
     */
    public function publicKey(): JsonResponse
    {
        return response()->json(config('stripe.STRIPE_KEY'), Response::HTTP_OK);
    }

    /**
     * @param CheckoutRequest $request
     * @return JsonResponse
     * @throws ApiErrorException
     */
    public function createPayIntent(CheckoutRequest $request): JsonResponse
    {
        Stripe::setApiKey(env('VITE_STRIPE_SECRET'));

        $address = Address::find($request->addressId);
        if (!$address) {
            // This should never happen because of validation, but it's good to have a fallback.
            Log::error('Address not found during payment intent creation.', ['addressId' => $request->addressId]);
            return response()->json(['error' => 'Invalid address.'], Response::HTTP_BAD_REQUEST);
        }

        Log::info('Address found', ['address' => $address]);

        $metadata = [
            'address_id' => $address->id,
            'user_id' => auth()->id(),
        ];
        Log::info('Metadata prepared', ['metadata' => $metadata]);

        $amountInCents = (int)round($request->amount * 100);
        Log::info('Amount calculated', ['amountInCents' => $amountInCents]);

        try {
            $paymentIntent = PaymentIntent::create([
                'amount' => $amountInCents,
                'currency' => 'eur',
                'payment_method_types' => ['card'],
                'description' => config('app.name') . ' Purchase',
                'metadata' => $metadata,
                'shipping' => [
                    'name' => $address->name . ' ' . $address->surname,
                    'address' => [
                        'line1' => $address->address,
                        'line2' => "",
                        'city' => $address->city,
                        'state' => $address->city,
                        'postal_code' => $address->postal_code,
                        'country' => mb_strtoupper(mb_substr($address->country, 0, 2)),
                    ],
                ],
            ]);

            Log::info('PaymentIntent created', ['paymentIntentId' => $paymentIntent->id]);

            return response()->json(['clientSecret' => $paymentIntent->client_secret]);
        } catch (ApiErrorException $e) {
            Log::error('Stripe API error:', [
                'message' => $e->getMessage(),
                'code' => $e->getCode(),
                'stripeCode' => $e->getStripeCode()
            ]);
            return response()->json(['error' => 'Payment processing failed. Please try again later.' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (Exception $e) {
            Log::error('Other error:', [
                'message' => $e->getMessage(),
            ]);
            return response()->json(['error' => 'Payment processing failed. Please try again later.' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
