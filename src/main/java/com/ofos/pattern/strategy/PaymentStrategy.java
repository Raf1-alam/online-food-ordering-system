package com.ofos.pattern.strategy;

import com.ofos.model.enums.PaymentMethod;
import java.math.BigDecimal;

/**
 * Strategy design pattern interface for payment processing.
 * 
 * Each payment method (Bkash, Credit Card) is a separate strategy class.
 * Adding a new method (e.g., Nagad) requires ONLY creating a new class
 * that implements this interface — zero changes to existing code (OCP).
 * 
 * DIP: PaymentService depends on this abstraction, not concrete implementations.
 * The PaymentStrategyFactory resolves the correct strategy at runtime.
 */
public interface PaymentStrategy {

    /**
     * Process a payment of the given amount.
     *
     * @param amount  The payment amount (computed server-side, NEVER from client)
     * @param orderId The order being paid for
     * @return A PaymentResult containing the transaction reference and status
     */
    PaymentResult processPayment(BigDecimal amount, Long orderId);

    /**
     * Returns the payment method this strategy handles.
     * Used by PaymentStrategyFactory for automatic registration.
     */
    PaymentMethod getPaymentMethod();
}
