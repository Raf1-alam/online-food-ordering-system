package com.ofos.exception;

import com.ofos.model.enums.PaymentMethod;

/**
 * Thrown by PaymentStrategyFactory when an unsupported payment method is requested.
 */
public class UnsupportedPaymentMethodException extends OfosException {

    public UnsupportedPaymentMethodException(PaymentMethod method) {
        super(String.format("Unsupported payment method: %s", method));
    }
}
