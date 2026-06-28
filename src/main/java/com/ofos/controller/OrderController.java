package com.ofos.controller;

import com.ofos.model.dto.request.OrderRequest;
import com.ofos.model.dto.response.ApiResponse;
import com.ofos.model.dto.response.OrderResponse;
import com.ofos.model.dto.response.CartResponse;
import com.ofos.service.OrderService;
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
import com.ofos.repository.UserRepository;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "Orders", description = "Order placement and customer order history")
@PreAuthorize("hasRole('CUSTOMER')")
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    @PostMapping
    @Operation(summary = "Checkout and place an order from the cart")
    public ResponseEntity<ApiResponse<OrderResponse>> placeOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody OrderRequest request) {
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        OrderResponse response = orderService.placeOrder(userId, request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order placed successfully", response));
    }

    @GetMapping
    @Operation(summary = "Get current customer's order history")
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails,
            Pageable pageable) {
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(orderService.getCustomerOrders(userId, pageable)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get specific order details")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'RESTAURANT_STAFF', 'ADMIN')")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrderById(id, userId)));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel an order (only if not already preparing)")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        OrderResponse response = orderService.cancelOrder(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Order cancelled", response));
    }

    @PostMapping("/{id}/reorder")
    @Operation(summary = "Reorder from a previous order")
    public ResponseEntity<ApiResponse<CartResponse>> reorder(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        CartResponse response = orderService.reorder(id, userId);
        return ResponseEntity.ok(ApiResponse.success("Items added to cart", response));
    }

    private Long getUserIdFromEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow().getId();
    }
}
