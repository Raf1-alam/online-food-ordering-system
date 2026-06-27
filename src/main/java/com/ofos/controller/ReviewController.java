package com.ofos.controller;

import com.ofos.model.dto.request.ReviewRequest;
import com.ofos.model.dto.response.ApiResponse;
import com.ofos.model.dto.response.ReviewResponse;
import com.ofos.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final com.ofos.repository.UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> addReview(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails,
            @Valid @RequestBody ReviewRequest request) {
        com.ofos.model.entity.User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(ApiResponse.success(reviewService.addReview(user.getId(), request)));
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getRestaurantReviews(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getReviewsForRestaurant(restaurantId)));
    }
}
