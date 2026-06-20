package com.ofos.model.enums;

/**
 * User roles for role-based access control (RBAC).
 * Used by Spring Security's @PreAuthorize annotations.
 */
public enum Role {
    CUSTOMER,
    RESTAURANT_STAFF,
    ADMIN
}
