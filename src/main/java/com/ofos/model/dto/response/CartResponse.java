package com.ofos.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {

    private Long id;
    private List<CartItemResponse> items;
    private BigDecimal totalAmount;
    private int totalItems;
    private String restaurantName;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemResponse {
        private Long id;
        private Long menuItemId;
        private String menuItemName;
        private BigDecimal menuItemPrice;
        private int quantity;
        private BigDecimal lineTotal;
    }
}
