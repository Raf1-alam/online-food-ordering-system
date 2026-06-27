package com.ofos.pattern.strategy;

import com.ofos.model.enums.PaymentMethod;
import com.ofos.model.enums.PaymentStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.UUID;

import java.math.BigDecimal;

/**
 * Cash on Delivery strategy implementation.
 * In a real application, this might do nothing except log the intent,
 * since the physical cash collection happens out of band.
 */
@Slf4j
@Component
public class CashOnDeliveryPaymentStrategy implements PaymentStrategy {

    @Override
    public PaymentResult processPayment(BigDecimal amount, Long orderId) {
        log.info("Processing Cash On Delivery for Order #{}, amount: ${}", orderId, amount);
        
        return PaymentResult.builder()
                .transactionRef("COD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .status(PaymentStatus.COMPLETED)
                .message("Payment to be collected on delivery")
                .build();
    }

    @Override
    public PaymentMethod getPaymentMethod() {
        return PaymentMethod.CASH_ON_DELIVERY;
    }
}
