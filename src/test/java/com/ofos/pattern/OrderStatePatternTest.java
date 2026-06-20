package com.ofos.pattern;

import com.ofos.exception.InvalidStateTransitionException;
import com.ofos.model.entity.Order;
import com.ofos.model.enums.OrderStatus;
import com.ofos.pattern.state.OrderState;
import com.ofos.pattern.state.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class OrderStatePatternTest {

    private Order order;

    @BeforeEach
    void setUp() {
        order = new Order();
        order.setStatus(OrderStatus.PLACED);
    }

    @Test
    @DisplayName("PlacedState should transition to ConfirmedState")
    void placedToConfirmed_Valid() {
        OrderState state = new PlacedState();
        
        assertTrue(state.canTransitionTo(OrderStatus.CONFIRMED));
        
        OrderState nextState = state.next(order);
        
        assertInstanceOf(ConfirmedState.class, nextState);
        assertEquals(OrderStatus.CONFIRMED, order.getStatus());
    }

    @Test
    @DisplayName("PlacedState should allow cancellation")
    void placedToCancelled_Valid() {
        OrderState state = new PlacedState();
        
        state.cancel(order);
        
        assertEquals(OrderStatus.CANCELLED, order.getStatus());
    }

    @Test
    @DisplayName("PreparingState should NOT transition backwards to Confirmed")
    void preparingToConfirmed_Invalid() {
        order.setStatus(OrderStatus.PREPARING);
        OrderState state = new PreparingState();
        
        assertFalse(state.canTransitionTo(OrderStatus.CONFIRMED));
    }

    @Test
    @DisplayName("PreparingState should NOT allow cancellation (food is already being made)")
    void preparingToCancelled_Invalid() {
        order.setStatus(OrderStatus.PREPARING);
        OrderState state = new PreparingState();
        
        InvalidStateTransitionException exception = assertThrows(InvalidStateTransitionException.class, () -> {
            state.cancel(order);
        });
        
        assertNotNull(exception);
    }
}
