package com.ofos.pattern.state;

import com.ofos.model.enums.OrderStatus;
import org.springframework.stereotype.Component;

/**
 * Factory that maps OrderStatus enum → corresponding OrderState instance.
 * Used when loading an order from the database to reconstruct its state object.
 * 
 * Factory Pattern: centralizes object creation logic, avoiding
 * scattered if/else or switch statements throughout the codebase.
 */
@Component
public class OrderStateFactory {

    /**
     * Creates the appropriate OrderState for the given OrderStatus.
     *
     * @param status The persisted order status from the database
     * @return The corresponding OrderState implementation
     * @throws IllegalArgumentException if the status has no mapping
     */
    public OrderState getState(OrderStatus status) {
        return switch (status) {
            case PLACED -> new PlacedState();
            case CONFIRMED -> new ConfirmedState();
            case PREPARING -> new PreparingState();
            case OUT_FOR_DELIVERY -> new OutForDeliveryState();
            case DELIVERED -> new DeliveredState();
            case CANCELLED -> new CancelledState();
        };
    }
}
