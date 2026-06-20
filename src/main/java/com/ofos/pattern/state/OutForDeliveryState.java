package com.ofos.pattern.state;

import com.ofos.exception.InvalidStateTransitionException;
import com.ofos.model.entity.Order;
import com.ofos.model.enums.OrderStatus;

/**
 * Order is out for delivery.
 * Valid transitions: DELIVERED
 * Cannot be cancelled while in transit.
 */
public class OutForDeliveryState implements OrderState {

    @Override
    public OrderStatus getStatus() {
        return OrderStatus.OUT_FOR_DELIVERY;
    }

    @Override
    public OrderState next(Order order) {
        order.setStatus(OrderStatus.DELIVERED);
        return new DeliveredState();
    }

    @Override
    public OrderState cancel(Order order) {
        throw new InvalidStateTransitionException(
                OrderStatus.OUT_FOR_DELIVERY.name(), OrderStatus.CANCELLED.name());
    }

    @Override
    public boolean canTransitionTo(OrderStatus target) {
        return target == OrderStatus.DELIVERED;
    }
}
