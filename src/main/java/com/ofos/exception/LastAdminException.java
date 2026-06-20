package com.ofos.exception;

/**
 * Thrown when attempting to demote or deactivate the last remaining admin.
 */
public class LastAdminException extends OfosException {

    public LastAdminException() {
        super("Cannot remove the last admin account. At least one admin must exist.");
    }
}
