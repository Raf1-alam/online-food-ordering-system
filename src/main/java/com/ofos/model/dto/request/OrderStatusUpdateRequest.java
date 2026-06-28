package com.ofos.model.dto.request;

import com.ofos.model.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusUpdateRequest {

    @NotNull(message = "Target status is required")
    private OrderStatus status;

    /**
     * Optional. Staff sets this when confirming an order (status -> CONFIRMED)
     * so the customer knows when to expect delivery. Ignored for other transitions
     * unless explicitly provided.
     */
    private LocalDateTime estimatedDeliveryTime;
}
