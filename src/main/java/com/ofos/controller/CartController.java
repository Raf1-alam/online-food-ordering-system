package com.ofos.controller;

import com.ofos.model.dto.request.CartItemRequest;
import com.ofos.model.dto.request.CartItemUpdateRequest;
import com.ofos.model.dto.response.ApiResponse;
import com.ofos.model.dto.response.CartResponse;
import com.ofos.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.ofos.repository.UserRepository;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "Shopping cart management for customers")
@PreAuthorize("hasRole('CUSTOMER')")
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Get the current user's cart")
    public ResponseEntity<ApiResponse<CartResponse>> getCart(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(cartService.getCart(userId)));
    }

    @PostMapping("/items")
    @Operation(summary = "Add an item to the cart")
    public ResponseEntity<ApiResponse<CartResponse>> addItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CartItemRequest request) {
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        CartResponse response = cartService.addItem(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Item added to cart", response));
    }

    @DeleteMapping("/items/{itemId}")
    @Operation(summary = "Remove an item from the cart")
    public ResponseEntity<ApiResponse<CartResponse>> removeItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long itemId) {
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        CartResponse response = cartService.removeItem(userId, itemId);
        return ResponseEntity.ok(ApiResponse.success("Item removed", response));
    }

    @PutMapping("/items/{itemId}")
    @Operation(summary = "Update cart item quantity")
    public ResponseEntity<ApiResponse<CartResponse>> updateItemQuantity(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long itemId,
            @Valid @RequestBody CartItemUpdateRequest request) {
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        CartResponse response = cartService.updateItemQuantity(userId, itemId, request.getQuantity());
        return ResponseEntity.ok(ApiResponse.success("Item quantity updated", response));
    }

    @DeleteMapping
    @Operation(summary = "Clear the entire cart")
    public ResponseEntity<ApiResponse<CartResponse>> clearCart(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        CartResponse response = cartService.clearCart(userId);
        return ResponseEntity.ok(ApiResponse.success("Cart cleared", response));
    }

    // Helper to resolve user ID from the JWT principal
    private Long getUserIdFromEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow().getId();
    }
}
