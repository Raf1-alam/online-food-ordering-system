package com.ofos.pattern.state;

import com.ofos.exception.InvalidStateTransitionException;
import com.ofos.model.entity.Order;
import com.ofos.model.enums.OrderStatus;

/**
 * Food is being prepared by the restaurant.
 * Valid transitions: OUT_FOR_DELIVERY
 * Cannot be cancelled once cooking has started.
 */
public class PreparingState implements OrderState {

    @Override
    public OrderStatus getStatus() {
        return OrderStatus.PREPARING;
    }

    @Override
    public OrderState next(Order order) {
        order.setStatus(OrderStatus.OUT_FOR_DELIVERY);
        return new OutForDeliveryState();
    }

    @Override
    public OrderState cancel(Order order) {
        throw new InvalidStateTransitionException(
                OrderStatus.PREPARING.name(), OrderStatus.CANCELLED.name());
    }

    @Override
    public boolean canTransitionTo(OrderStatus target) {
        return target == OrderStatus.OUT_FOR_DELIVERY;
    }
}
