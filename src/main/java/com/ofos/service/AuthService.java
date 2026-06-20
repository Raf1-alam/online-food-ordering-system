package com.ofos.service;

import com.ofos.model.dto.request.LoginRequest;
import com.ofos.model.dto.request.RefreshTokenRequest;
import com.ofos.model.dto.request.RegisterRequest;
import com.ofos.model.dto.response.AuthResponse;

/**
 * Authentication service interface.
 * DIP: Controllers depend on this abstraction, not the implementation.
 */
public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    void logout(String refreshToken);
}
