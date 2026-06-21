package com.ofos.controller;

import com.ofos.model.dto.request.ApplicationRequest;
import com.ofos.model.dto.response.ApiResponse;
import com.ofos.model.dto.response.ApplicationResponse;
import com.ofos.service.RestaurantApplicationService;
import com.ofos.repository.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
@Tag(name = "Restaurant Applications", description = "Partner onboarding workflow")
public class RestaurantApplicationController {

    private final RestaurantApplicationService applicationService;
    private final UserRepository userRepository;

    @PostMapping
    @Operation(summary = "Submit an application to become a restaurant partner")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ApplicationResponse>> submitApplication(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ApplicationRequest request) {
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        ApplicationResponse response = applicationService.submitApplication(request, userId);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Application submitted successfully", response));
    }

    @GetMapping("/my")
    @Operation(summary = "Get the current user's application status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ApplicationResponse>> getMyApplication(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(applicationService.getMyApplication(userId)));
    }

    @GetMapping
    @Operation(summary = "List all applications (Admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<ApplicationResponse>>> getAllApplications(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(applicationService.getAllApplications(pageable)));
    }

    @PostMapping("/{id}/approve")
    @Operation(summary = "Approve an application (Admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> approveApplication(
            @PathVariable Long id,
            @RequestBody(required = false) String adminNotes) {
        return ResponseEntity.ok(ApiResponse.success("Application approved", applicationService.approveApplication(id, adminNotes)));
    }

    @PostMapping("/{id}/reject")
    @Operation(summary = "Reject an application (Admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> rejectApplication(
            @PathVariable Long id,
            @RequestBody(required = false) String adminNotes) {
        return ResponseEntity.ok(ApiResponse.success("Application rejected", applicationService.rejectApplication(id, adminNotes)));
    }

    private Long getUserIdFromEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow().getId();
    }
}
