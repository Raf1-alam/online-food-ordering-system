package com.ofos.repository;

import com.ofos.model.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByRestaurantIdOrderByCreatedAtDesc(Long restaurantId);
    boolean existsByUserIdAndRestaurantId(Long userId, Long restaurantId);
}
