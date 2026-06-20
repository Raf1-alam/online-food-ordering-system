package com.ofos.pattern.strategy;

import com.ofos.model.enums.PaymentMethod;
import com.ofos.model.enums.PaymentStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Mocked Credit Card payment strategy.
 * 
 * In a real system, this would integrate with a PCI-DSS compliant
 * payment gateway (e.g., Stripe, Square).
 * Card details are never logged — only masked references.
 */
@Component
@Slf4j
public class CreditCardPaymentStrategy implements PaymentStrategy {

    @Override
    public PaymentResult processPayment(BigDecimal amount, Long orderId) {
        // Simulate credit card payment processing
        log.info("Processing Credit Card payment of {} BDT for order #{}", amount, orderId);

        // In production: call payment gateway API here
        // Never log full card numbers — PCI-DSS compliance
        String transactionRef = "CC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        log.info("Credit Card payment successful. Transaction ref: {}", transactionRef);

        return PaymentResult.builder()
                .status(PaymentStatus.COMPLETED)
                .transactionRef(transactionRef)
                .message("Credit Card payment processed successfully")
                .build();
    }

    @Override
    public PaymentMethod getPaymentMethod() {
        return PaymentMethod.CREDIT_CARD;
    }
}
