package com.ofos.controller;

import com.ofos.model.dto.request.UserAddressRequest;
import com.ofos.model.dto.response.ApiResponse;
import com.ofos.model.dto.response.UserAddressResponse;
import com.ofos.repository.UserRepository;
import com.ofos.service.UserAddressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/addresses")
@RequiredArgsConstructor
@Tag(name = "User Addresses", description = "Manage customer delivery addresses")
@PreAuthorize("hasRole('CUSTOMER')")
public class UserAddressController {

    private final UserAddressService addressService;
    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Get current customer's saved addresses")
    public ResponseEntity<ApiResponse<List<UserAddressResponse>>> getMyAddresses(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(addressService.getUserAddresses(userId)));
    }

    @PostMapping
    @Operation(summary = "Save a new address")
    public ResponseEntity<ApiResponse<UserAddressResponse>> addAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UserAddressRequest request) {
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        UserAddressResponse response = addressService.addAddress(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Address saved", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an address")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        addressService.deleteAddress(userId, id);
        return ResponseEntity.ok(ApiResponse.success("Address deleted", null));
    }

    @PatchMapping("/{id}/default")
    @Operation(summary = "Set an address as default")
    public ResponseEntity<ApiResponse<UserAddressResponse>> setDefaultAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        UserAddressResponse response = addressService.setDefaultAddress(userId, id);
        return ResponseEntity.ok(ApiResponse.success("Default address updated", response));
    }

    private Long getUserIdFromEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow().getId();
    }
}
