package com.ofos.exception;

public class ResourceNotFoundException extends OfosException {

    public ResourceNotFoundException(String resource, String field, Object value) {
        super(String.format("%s not found with %s: '%s'", resource, field, value));
    }
}
