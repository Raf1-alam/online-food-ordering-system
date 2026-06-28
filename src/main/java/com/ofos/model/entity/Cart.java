package com.ofos.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Cart entity — one cart per authenticated user.
 * 
 * Rich domain model (NOT anemic): business logic like addItem(),
 * removeItem(), and calculateTotal() live here instead of in the service layer.
 * This avoids the Feature Envy code smell.
 */
@Entity
@Table(name = "carts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<CartItem> items = new ArrayList<>();

    // ==================== Domain Behavior (Rich Model) ====================

    /**
     * Calculates the total price of all items in the cart.
     * Uses server-side prices from MenuItem — never trusts client-provided amounts.
     */
    public BigDecimal calculateTotal() {
        return items.stream()
                .map(item -> item.getMenuItem().getPrice()
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Adds an item to the cart or increments quantity if already present.
     * Validates that the item belongs to the same restaurant as existing items.
     *
     * @throws IllegalArgumentException if the item is from a different restaurant
     */
    public void addItem(MenuItem menuItem, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }

        // Enforce single-restaurant cart constraint
        if (!items.isEmpty()) {
            Long existingRestaurantId = items.get(0).getMenuItem().getRestaurant().getId();
            if (!menuItem.getRestaurant().getId().equals(existingRestaurantId)) {
                throw new IllegalArgumentException(
                        "Cannot add items from different restaurants. Clear your cart first.");
            }
        }

        // Check if item already in cart — increment quantity instead of duplicating
        for (CartItem cartItem : items) {
            if (cartItem.getMenuItem().getId().equals(menuItem.getId())) {
                cartItem.setQuantity(cartItem.getQuantity() + quantity);
                return;
            }
        }

        // New item
        CartItem cartItem = CartItem.builder()
                .cart(this)
                .menuItem(menuItem)
                .quantity(quantity)
                .build();
        items.add(cartItem);
    }

    /**
     * Updates the quantity of an item in the cart.
     * @throws IllegalArgumentException if quantity <= 0
     */
    public void updateItemQty(Long cartItemId, int newQuantity) {
        if (newQuantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive. Use removeItem to delete.");
        }
        for (CartItem cartItem : items) {
            if (cartItem.getId().equals(cartItemId)) {
                cartItem.setQuantity(newQuantity);
                return;
            }
        }
        throw new IllegalArgumentException("Cart item not found");
    }

    /**
     * Removes an item from the cart by its cart item ID.
     */
    public void removeItem(Long cartItemId) {
        items.removeIf(item -> item.getId().equals(cartItemId));
    }

    /**
     * Clears all items from the cart (e.g., after successful checkout).
     */
    public void clear() {
        items.clear();
    }

    /**
     * Checks if the cart is empty.
     */
    public boolean isEmpty() {
        return items.isEmpty();
    }
}
