package com.ofos.controller;

import com.ofos.model.dto.response.ApiResponse;
import com.ofos.model.entity.Restaurant;
import com.ofos.model.entity.User;
import com.ofos.repository.RestaurantRepository;
import com.ofos.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;

    @PostMapping("/{restaurantId}")
    @Transactional
    public ResponseEntity<ApiResponse<String>> toggleFavorite(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails,
            @PathVariable Long restaurantId) {
        
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        if (user.getFavoriteRestaurants().contains(restaurant)) {
            user.getFavoriteRestaurants().remove(restaurant);
            return ResponseEntity.ok(ApiResponse.success("Removed from favorites"));
        } else {
            user.getFavoriteRestaurants().add(restaurant);
            return ResponseEntity.ok(ApiResponse.success("Added to favorites"));
        }
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<Set<Long>>> getMyFavorites(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Set<Long> favoriteIds = user.getFavoriteRestaurants().stream()
                .map(Restaurant::getId)
                .collect(Collectors.toSet());
        return ResponseEntity.ok(ApiResponse.success(favoriteIds));
    }
}
