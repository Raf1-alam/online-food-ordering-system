package com.ofos.model.enums;

/**
 * Order lifecycle states managed by the State design pattern.
 * 
 * Valid transitions:
 *   PLACED → CONFIRMED → PREPARING → OUT_FOR_DELIVERY → DELIVERED
 *   PLACED → CANCELLED
 *   CONFIRMED → CANCELLED
 * 
 * DELIVERED and CANCELLED are terminal states.
 */
public enum OrderStatus {
    PLACED,
    CONFIRMED,
    PREPARING,
    OUT_FOR_DELIVERY,
    DELIVERED,
    CANCELLED
}
