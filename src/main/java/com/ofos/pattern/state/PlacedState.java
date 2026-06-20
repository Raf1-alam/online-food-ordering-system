package com.ofos.pattern.state;

import com.ofos.exception.InvalidStateTransitionException;
import com.ofos.model.entity.Order;
import com.ofos.model.enums.OrderStatus;

/**
 * Initial state after order is created.
 * Valid transitions: CONFIRMED, CANCELLED
 */
public class PlacedState implements OrderState {

    @Override
    public OrderStatus getStatus() {
        return OrderStatus.PLACED;
    }

    @Override
    public OrderState next(Order order) {
        order.setStatus(OrderStatus.CONFIRMED);
        return new ConfirmedState();
    }

    @Override
    public OrderState cancel(Order order) {
        order.setStatus(OrderStatus.CANCELLED);
        return new CancelledState();
    }

    @Override
    public boolean canTransitionTo(OrderStatus target) {
        return target == OrderStatus.CONFIRMED || target == OrderStatus.CANCELLED;
    }
}
