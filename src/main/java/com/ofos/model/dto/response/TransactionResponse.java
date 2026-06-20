package com.ofos.model.dto.response;

import com.ofos.model.enums.PaymentMethod;
import com.ofos.model.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Transaction response for admin panel filtering.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {

    private Long paymentId;
    private Long orderId;
    private String customerName;
    private String customerEmail;
    private String restaurantName;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private String transactionRef;
    private LocalDateTime paidAt;
}
