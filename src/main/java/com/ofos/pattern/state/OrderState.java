package com.ofos.pattern.state;

import com.ofos.model.entity.Order;
import com.ofos.model.enums.OrderStatus;

/**
 * State design pattern interface for order lifecycle management.
 * 
 * Each concrete state knows:
 * 1. Its own status
 * 2. Which transitions are valid from its state
 * 3. How to transition to the next state
 * 4. Whether cancellation is allowed
 * 
 * OCP: Adding a new state (e.g., READY_FOR_PICKUP) requires only a new class —
 * existing state classes and OrderService remain unchanged.
 * 
 * SRP: Each state class handles ONLY its own transition logic.
 * 
 * LSP: All implementations are interchangeable through this interface.
 */
public interface OrderState {

    /**
     * Returns the OrderStatus enum value this state represents.
     */
    OrderStatus getStatus();

    /**
     * Transitions the order to the next state in the lifecycle.
     *
     * @param order The order to transition
     * @return The new OrderState after transition
     * @throws com.ofos.exception.InvalidStateTransitionException if transition is not valid
     */
    OrderState next(Order order);

    /**
     * Attempts to cancel the order from this state.
     *
     * @param order The order to cancel
     * @return The CancelledState
     * @throws com.ofos.exception.InvalidStateTransitionException if cancellation is not allowed
     */
    OrderState cancel(Order order);

    /**
     * Checks if a specific target status is reachable from this state.
     */
    boolean canTransitionTo(OrderStatus target);
}
