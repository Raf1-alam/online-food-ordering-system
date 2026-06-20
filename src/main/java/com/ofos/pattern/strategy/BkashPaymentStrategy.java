package com.ofos.pattern.strategy;

import com.ofos.model.enums.PaymentMethod;
import com.ofos.model.enums.PaymentStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Mocked Bkash payment strategy.
 * 
 * In a real system, this would integrate with Bkash's API.
 * For demonstration, it simulates payment processing and generates
 * a mock transaction reference.
 */
@Component
@Slf4j
public class BkashPaymentStrategy implements PaymentStrategy {

    @Override
    public PaymentResult processPayment(BigDecimal amount, Long orderId) {
        // Simulate Bkash payment processing
        log.info("Processing Bkash payment of {} BDT for order #{}", amount, orderId);

        // In production: call Bkash API here
        // Mocked: always succeeds with a generated reference
        String transactionRef = "BK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        log.info("Bkash payment successful. Transaction ref: {}", transactionRef);

        return PaymentResult.builder()
                .status(PaymentStatus.COMPLETED)
                .transactionRef(transactionRef)
                .message("Bkash payment processed successfully")
                .build();
    }

    @Override
    public PaymentMethod getPaymentMethod() {
        return PaymentMethod.BKASH;
    }
}
