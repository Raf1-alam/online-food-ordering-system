package com.ofos.controller;

import com.ofos.model.dto.request.UserProfileUpdateRequest;
import com.ofos.model.dto.response.ApiResponse;
import com.ofos.model.dto.response.UserProfileResponse;
import com.ofos.repository.UserRepository;
import com.ofos.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User profile management")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @GetMapping("/profile")
    @Operation(summary = "Get the current authenticated user's profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(userService.getProfile(userId)));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update the current authenticated user's profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UserProfileUpdateRequest request) {
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", userService.updateProfile(userId, request)));
    }

    private Long getUserIdFromEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow().getId();
    }
}
