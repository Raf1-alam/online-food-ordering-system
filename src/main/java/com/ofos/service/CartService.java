package com.ofos.service;

import com.ofos.model.dto.request.CartItemRequest;
import com.ofos.model.dto.response.CartResponse;

public interface CartService {

    CartResponse getCart(Long userId);

    CartResponse addItem(Long userId, CartItemRequest request);

    CartResponse removeItem(Long userId, Long cartItemId);

    CartResponse clearCart(Long userId);
}
