package com.ofos.model.dto.response;

import com.ofos.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Auth response containing token pair and user info.
 * Never includes password hash or other sensitive fields.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private long expiresIn;
    private Long userId;
    private String email;
    private String fullName;
    private Role role;
}
