package com.ofos.service;

import com.ofos.model.dto.request.ReviewRequest;
import com.ofos.model.dto.response.ReviewResponse;
import com.ofos.model.entity.Restaurant;
import com.ofos.model.entity.Review;
import com.ofos.model.entity.User;
import com.ofos.repository.RestaurantRepository;
import com.ofos.repository.ReviewRepository;
import com.ofos.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;

    @Transactional
    public ReviewResponse addReview(Long userId, ReviewRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        if (reviewRepository.existsByUserIdAndRestaurantId(userId, request.getRestaurantId())) {
            throw new RuntimeException("You have already reviewed this restaurant.");
        }

        Review review = new Review();
        review.setUser(user);
        review.setRestaurant(restaurant);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        
        Review saved = reviewRepository.save(review);
        
        return ReviewResponse.builder()
                .id(saved.getId())
                .userId(user.getId())
                .userName(user.getFullName())
                .rating(saved.getRating())
                .comment(saved.getComment())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsForRestaurant(Long restaurantId) {
        return reviewRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurantId).stream()
                .map(r -> ReviewResponse.builder()
                        .id(r.getId())
                        .userId(r.getUser().getId())
                        .userName(r.getUser().getFullName())
                        .rating(r.getRating())
                        .comment(r.getComment())
                        .createdAt(r.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}
