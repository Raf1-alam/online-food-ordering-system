package com.ofos.model.dto.response;

import com.ofos.model.enums.OrderStatus;
import com.ofos.model.enums.PaymentMethod;
import com.ofos.model.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private Long id;
    private Long userId;
    private String customerName;
    private Long restaurantId;
    private String restaurantName;
    private List<OrderItemResponse> items;
    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private String couponCode;
    private OrderStatus status;
    private String deliveryAddress;
    private LocalDateTime estimatedDeliveryTime;
    private PaymentInfo payment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemResponse {
        private Long id;
        private String itemName;
        private BigDecimal itemPrice;
        private int quantity;
        private BigDecimal lineTotal;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentInfo {
        private PaymentMethod method;
        private PaymentStatus status;
        private String transactionRef;
        private LocalDateTime paidAt;
    }
}
