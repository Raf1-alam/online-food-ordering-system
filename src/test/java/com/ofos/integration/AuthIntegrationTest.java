package com.ofos.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ofos.model.dto.request.LoginRequest;
import com.ofos.model.dto.request.RegisterRequest;
import com.ofos.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AuthIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Should successfully register a new customer and save to database")
    void testRegisterUser_Success() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "Integration Test User",
                "integration@test.com",
                "Password123!",
                "1234567890"
        );

        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value("integration@test.com"))
                .andExpect(jsonPath("$.data.role").value("CUSTOMER"))
                .andExpect(jsonPath("$.data.accessToken").exists());

        // Verify it was actually saved in the Testcontainers MySQL DB
        assertTrue(userRepository.findByEmail("integration@test.com").isPresent());
    }

    @Test
    @DisplayName("Should login and receive JWT tokens")
    void testLogin_Success() throws Exception {
        // Register a user explicitly to guarantee existence
        RegisterRequest registerReq = new RegisterRequest(
                "Test Admin", "testadmin@ofos.com", "Admin123!", "9998887776"
        );
        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerReq)));

        // Now login
        LoginRequest loginReq = new LoginRequest("testadmin@ofos.com", "Admin123!");

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").exists())
                .andExpect(jsonPath("$.data.refreshToken").exists());
    }

    @Test
    @DisplayName("Should reject login with bad credentials")
    void testLogin_BadCredentials() throws Exception {
        LoginRequest request = new LoginRequest("admin@ofos.com", "WrongPassword!");

        mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized()) // Should map to 401 via GlobalExceptionHandler
                .andExpect(jsonPath("$.success").value(false));
    }
}
