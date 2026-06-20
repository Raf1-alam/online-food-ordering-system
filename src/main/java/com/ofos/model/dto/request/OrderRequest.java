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
}
