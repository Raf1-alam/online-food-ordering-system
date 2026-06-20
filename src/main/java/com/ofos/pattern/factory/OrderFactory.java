package com.ofos.pattern.factory;

import com.ofos.model.entity.*;
import com.ofos.model.enums.OrderStatus;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

/**
 * Factory for assembling Order entities from cart data.
 * 
 * Factory Pattern: Centralizes the complex creation logic for Order + OrderItems.
 * Without this factory, order assembly code would be duplicated or
 * scattered across services (violating SRP).
 * 
 * Key responsibility: snapshot current prices from menu items into OrderItems
 * so that historical order data remains accurate even if prices change later.
 */
@Component
public class OrderFactory {

    /**
     * Creates an Order from the user's cart, snapshotting current prices.
     *
     * @param user       The customer placing the order
     * @param restaurant The restaurant receiving the order
     * @param cartItems  The items in the customer's cart
     * @param deliveryAddress The delivery address
     * @return A fully assembled Order entity ready for persistence
     */
    public Order createOrder(User user, Restaurant restaurant,
                             List<CartItem> cartItems, String deliveryAddress) {
        Order order = Order.builder()
                .user(user)
                .restaurant(restaurant)
                .status(OrderStatus.PLACED)
                .deliveryAddress(deliveryAddress)
                .build();

        // Create OrderItems with price snapshots (encapsulation)
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (CartItem cartItem : cartItems) {
            MenuItem menuItem = cartItem.getMenuItem();

            OrderItem orderItem = OrderItem.builder()
                    .menuItem(menuItem)
                    .itemName(menuItem.getName())          // Snapshot name
                    .itemPrice(menuItem.getPrice())        // Snapshot price
                    .quantity(cartItem.getQuantity())
                    .build();

            order.addItem(orderItem);
            totalAmount = totalAmount.add(orderItem.getLineTotal());
        }

        order.setTotalAmount(totalAmount);
        return order;
    }
}
