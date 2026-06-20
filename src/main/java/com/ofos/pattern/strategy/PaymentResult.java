package com.ofos.pattern.strategy;

import com.ofos.model.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

/**
 * Result object returned by PaymentStrategy implementations.
 */
@Data
@Builder
@AllArgsConstructor
public class PaymentResult {

    private PaymentStatus status;
    private String transactionRef;
    private String message;
}
