package com.ofos.service.impl;

import com.ofos.exception.ResourceNotFoundException;
import com.ofos.model.dto.request.CartItemRequest;
import com.ofos.model.dto.response.CartResponse;
import com.ofos.model.entity.Cart;
import com.ofos.model.entity.CartItem;
import com.ofos.model.entity.MenuItem;
import com.ofos.model.entity.User;
import com.ofos.repository.CartRepository;
import com.ofos.repository.MenuItemRepository;
import com.ofos.repository.UserRepository;
import com.ofos.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Cart service implementation.
 * 
 * Demonstrates a Rich Domain Model: the actual logic for adding items,
 * checking restaurant constraints, and computing totals lives in the Cart entity.
 * This service simply orchestrates fetching and saving (avoids Anemic Domain Model).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final MenuItemRepository menuItemRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public CartResponse getCart(Long userId) {
        return cartRepository.findByUserIdWithItems(userId)
                .map(this::toResponse)
                .orElseGet(() -> createEmptyCartResponse(userId));
    }

    @Override
    @Transactional
    public CartResponse addItem(Long userId, CartItemRequest request) {
        Cart cart = getOrCreateCart(userId);
        
        MenuItem menuItem = menuItemRepository.findById(request.getMenuItemId())
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", request.getMenuItemId()));

        if (!menuItem.isAvailable()) {
            throw new IllegalArgumentException("Menu item is currently unavailable");
        }

        // The Cart entity enforces the single-restaurant business rule (Rich Domain Model)
        cart.addItem(menuItem, request.getQuantity());
        
        cart = cartRepository.save(cart);
        log.info("Item added to cart for user {}", userId);
        return toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse removeItem(Long userId, Long cartItemId) {
        Cart cart = getOrCreateCart(userId);
        
        // Logic lives in the entity
        cart.removeItem(cartItemId);
        
        cart = cartRepository.save(cart);
        log.info("Item removed from cart for user {}", userId);
        return toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse updateItemQuantity(Long userId, Long cartItemId, int quantity) {
        Cart cart = getOrCreateCart(userId);
        cart.updateItemQty(cartItemId, quantity);
        cart = cartRepository.save(cart);
        log.info("Item quantity updated in cart for user {}", userId);
        return toResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        
        // Logic lives in the entity
        cart.clear();
        
        cart = cartRepository.save(cart);
        log.info("Cart cleared for user {}", userId);
        return toResponse(cart);
    }

    // ==================== Helpers ====================

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserIdWithItems(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
                    Cart newCart = Cart.builder().user(user).build();
                    return cartRepository.save(newCart);
                });
    }

    private CartResponse createEmptyCartResponse(Long userId) {
        return CartResponse.builder()
                .id(null)
                .items(List.of())
                .totalAmount(java.math.BigDecimal.ZERO)
                .totalItems(0)
                .restaurantName(null)
                .build();
    }

    private CartResponse toResponse(Cart cart) {
        List<CartResponse.CartItemResponse> itemResponses = cart.getItems().stream()
                .map(this::toCartItemResponse)
                .collect(Collectors.toList());

        String restaurantName = cart.getItems().isEmpty() ? null :
                cart.getItems().get(0).getMenuItem().getRestaurant().getName();

        return CartResponse.builder()
                .id(cart.getId())
                .items(itemResponses)
                .totalAmount(cart.calculateTotal()) // Entity method
                .totalItems(cart.getItems().stream().mapToInt(CartItem::getQuantity).sum())
                .restaurantName(restaurantName)
                .build();
    }

    private CartResponse.CartItemResponse toCartItemResponse(CartItem item) {
        java.math.BigDecimal itemPrice = item.getMenuItem().getPrice();
        java.math.BigDecimal lineTotal = itemPrice.multiply(java.math.BigDecimal.valueOf(item.getQuantity()));

        return CartResponse.CartItemResponse.builder()
                .id(item.getId())
                .menuItemId(item.getMenuItem().getId())
                .menuItemName(item.getMenuItem().getName())
                .menuItemPrice(itemPrice)
                .quantity(item.getQuantity())
                .lineTotal(lineTotal)
                .build();
    }
}
