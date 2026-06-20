package com.ofos.controller;

import com.ofos.model.dto.request.MenuItemRequest;
import com.ofos.model.dto.request.RestaurantRequest;
import com.ofos.model.dto.response.ApiResponse;
import com.ofos.model.dto.response.MenuItemResponse;
import com.ofos.model.dto.response.RestaurantResponse;
import com.ofos.service.MenuService;
import com.ofos.service.RestaurantService;
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
@RequestMapping("/api/v1/restaurants")
@RequiredArgsConstructor
@Tag(name = "Restaurants & Menus", description = "Public browsing and staff management")
public class RestaurantController {

    private final RestaurantService restaurantService;
    private final MenuService menuService;
    private final UserRepository userRepository;

    // ==================== Public Endpoints ====================

    @GetMapping
    @Operation(summary = "List all active restaurants")
    public ResponseEntity<ApiResponse<Page<RestaurantResponse>>> getAllRestaurants(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(restaurantService.getAllRestaurants(pageable)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get restaurant details")
    public ResponseEntity<ApiResponse<RestaurantResponse>> getRestaurantById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(restaurantService.getRestaurantById(id)));
    }

    @GetMapping("/{id}/menu")
    @Operation(summary = "Get menu for a restaurant (supports searching)")
    public ResponseEntity<ApiResponse<Page<MenuItemResponse>>> getMenu(
            @PathVariable Long id,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(menuService.getMenuByRestaurant(id, search, pageable)));
    }

    // ==================== Staff / Admin Endpoints ====================

    @PostMapping
    @Operation(summary = "Create a new restaurant (Admin only)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RestaurantResponse>> createRestaurant(
            @Valid @RequestBody RestaurantRequest request) {
        RestaurantResponse response = restaurantService.createRestaurant(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Restaurant created", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update restaurant details (Staff owner or Admin)")
    @PreAuthorize("hasAnyRole('RESTAURANT_STAFF', 'ADMIN')")
    public ResponseEntity<ApiResponse<RestaurantResponse>> updateRestaurant(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody RestaurantRequest request) {
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        RestaurantResponse response = restaurantService.updateRestaurant(id, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Restaurant updated", response));
    }

    @PostMapping("/{restaurantId}/menu")
    @Operation(summary = "Add an item to the menu")
    @PreAuthorize("hasAnyRole('RESTAURANT_STAFF', 'ADMIN')")
    public ResponseEntity<ApiResponse<MenuItemResponse>> createMenuItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long restaurantId,
            @Valid @RequestBody MenuItemRequest request) {
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        MenuItemResponse response = menuService.createMenuItem(restaurantId, request, userId);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Menu item added", response));
    }

    @PutMapping("/{restaurantId}/menu/{itemId}")
    @Operation(summary = "Update a menu item")
    @PreAuthorize("hasAnyRole('RESTAURANT_STAFF', 'ADMIN')")
    public ResponseEntity<ApiResponse<MenuItemResponse>> updateMenuItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long restaurantId,
            @PathVariable Long itemId,
            @Valid @RequestBody MenuItemRequest request) {
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        MenuItemResponse response = menuService.updateMenuItem(itemId, request, userId);
        return ResponseEntity.ok(ApiResponse.success("Menu item updated", response));
    }

    @DeleteMapping("/{restaurantId}/menu/{itemId}")
    @Operation(summary = "Soft delete a menu item")
    @PreAuthorize("hasAnyRole('RESTAURANT_STAFF', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteMenuItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long restaurantId,
            @PathVariable Long itemId) {
        Long userId = getUserIdFromEmail(userDetails.getUsername());
        menuService.deleteMenuItem(itemId, userId);
        return ResponseEntity.ok(ApiResponse.success("Menu item deleted", null));
    }

    private Long getUserIdFromEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow().getId();
    }
}
