package com.ofos.exception;

/**
 * Base exception for all OFOS-specific business logic exceptions.
 * Provides a consistent hierarchy for the GlobalExceptionHandler.
 */
public abstract class OfosException extends RuntimeException {

    protected OfosException(String message) {
        super(message);
    }

    protected OfosException(String message, Throwable cause) {
        super(message, cause);
    }
}
