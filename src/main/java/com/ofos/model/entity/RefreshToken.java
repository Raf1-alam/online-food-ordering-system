package com.ofos.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * RefreshToken entity for JWT token rotation.
 * Stored server-side so tokens can be revoked on logout.
 * 
 * On each refresh:
 * 1. Old token is invalidated (revoked = true)
 * 2. New access + refresh token pair is issued
 * This prevents replay attacks if a token leaks.
 */
@Entity
@Table(name = "refresh_tokens", indexes = {
        @Index(name = "idx_refresh_token", columnList = "token")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    @Column(nullable = false)
    @Builder.Default
    private boolean revoked = false;

    /**
     * Checks if this refresh token has expired.
     */
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryDate);
    }

    /**
     * Checks if this token is usable (not revoked and not expired).
     */
    public boolean isValid() {
        return !revoked && !isExpired();
    }
}
