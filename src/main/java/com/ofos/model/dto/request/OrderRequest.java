package com.ofos.model.dto.request;

import com.ofos.model.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    @Size(max = 500, message = "Delivery address must not exceed 500 characters")
    private String deliveryAddress;

    @Size(max = 50, message = "Coupon code must not exceed 50 characters")
    private String couponCode;
}
