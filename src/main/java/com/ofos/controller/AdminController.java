package com.ofos.controller;

import com.ofos.model.dto.request.RoleUpdateRequest;
import com.ofos.model.dto.response.ApiResponse;
import com.ofos.model.dto.response.TransactionResponse;
import com.ofos.model.dto.response.UserResponse;
import com.ofos.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "System-wide administration endpoints")
@PreAuthorize("hasRole('ADMIN')") // Entire controller restricted to ADMIN
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    @Operation(summary = "List all users")
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getAllUsers(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllUsers(pageable)));
    }

    @PatchMapping("/users/{id}/role")
    @Operation(summary = "Change a user's role (Customer -> Staff)")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserRole(
            @PathVariable Long id,
            @Valid @RequestBody RoleUpdateRequest request) {
        UserResponse response = adminService.updateUserRole(id, request);
        return ResponseEntity.ok(ApiResponse.success("User role updated", response));
    }

    @PatchMapping("/users/{id}/toggle-status")
    @Operation(summary = "Activate/Deactivate a user account")
    public ResponseEntity<ApiResponse<Void>> toggleUserStatus(@PathVariable Long id) {
        adminService.toggleUserStatus(id);
        return ResponseEntity.ok(ApiResponse.success("User status toggled", null));
    }

    @GetMapping("/transactions")
    @Operation(summary = "View all system transactions")
    public ResponseEntity<ApiResponse<Page<TransactionResponse>>> getAllTransactions(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllTransactions(pageable)));
    }
}
