package com.ofos.exception;

/**
 * Thrown when an invalid order state transition is attempted.
 * Used by the State pattern to enforce valid lifecycle transitions.
 */
public class InvalidStateTransitionException extends OfosException {

    public InvalidStateTransitionException(String currentState, String targetState) {
        super(String.format("Cannot transition from %s to %s", currentState, targetState));
    }
}
