package com.ofos.model.enums;

/**
 * Supported payment methods resolved by the Strategy design pattern.
 * Adding a new method (e.g., NAGAD) requires only a new Strategy class —
 * no changes to existing code (Open/Closed Principle).
 */
public enum PaymentMethod {
    CASH_ON_DELIVERY
}
