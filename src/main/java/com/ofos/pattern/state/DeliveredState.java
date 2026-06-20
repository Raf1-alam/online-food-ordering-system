package com.ofos.pattern.state;

import com.ofos.exception.InvalidStateTransitionException;
import com.ofos.model.entity.Order;
import com.ofos.model.enums.OrderStatus;

/**
 * Terminal state — order has been delivered.
 * No further transitions allowed.
 */
public class DeliveredState implements OrderState {

    @Override
    public OrderStatus getStatus() {
        return OrderStatus.DELIVERED;
    }

    @Override
    public OrderState next(Order order) {
        throw new InvalidStateTransitionException(
                OrderStatus.DELIVERED.name(), "any state");
    }

    @Override
    public OrderState cancel(Order order) {
        throw new InvalidStateTransitionException(
                OrderStatus.DELIVERED.name(), OrderStatus.CANCELLED.name());
    }

    @Override
    public boolean canTransitionTo(OrderStatus target) {
        return false; // Terminal state
    }
}
