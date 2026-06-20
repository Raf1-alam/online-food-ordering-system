package com.ofos.pattern.state;

import com.ofos.exception.InvalidStateTransitionException;
import com.ofos.model.entity.Order;
import com.ofos.model.enums.OrderStatus;

/**
 * Order has been confirmed by the restaurant.
 * Valid transitions: PREPARING, CANCELLED
 */
public class ConfirmedState implements OrderState {

    @Override
    public OrderStatus getStatus() {
        return OrderStatus.CONFIRMED;
    }

    @Override
    public OrderState next(Order order) {
        order.setStatus(OrderStatus.PREPARING);
        return new PreparingState();
    }

    @Override
    public OrderState cancel(Order order) {
        order.setStatus(OrderStatus.CANCELLED);
        return new CancelledState();
    }

    @Override
    public boolean canTransitionTo(OrderStatus target) {
        return target == OrderStatus.PREPARING || target == OrderStatus.CANCELLED;
    }
}
