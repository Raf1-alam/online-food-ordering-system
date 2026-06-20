package com.ofos.repository;

import com.ofos.model.entity.MenuItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    Page<MenuItem> findByRestaurantIdAndAvailableTrue(Long restaurantId, Pageable pageable);

    /**
     * Search/filter menu items by name or category (case-insensitive).
     * Uses parameterized query — SQL injection safe (JPA requirement).
     */
    @Query("SELECT m FROM MenuItem m WHERE m.restaurant.id = :restaurantId " +
           "AND m.available = true " +
           "AND (LOWER(m.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(m.category) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<MenuItem> searchByRestaurant(
            @Param("restaurantId") Long restaurantId,
            @Param("search") String search,
            Pageable pageable);
}
