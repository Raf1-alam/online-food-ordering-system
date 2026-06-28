package com.ofos.repository;

import com.ofos.model.entity.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

    Page<Restaurant> findByActiveTrue(Pageable pageable);
    
    Page<Restaurant> findByActiveTrueAndNameContainingIgnoreCase(String name, Pageable pageable);

    List<Restaurant> findByActiveTrue();

    List<Restaurant> findByActiveTrueAndNameContainingIgnoreCase(String name);

    List<Restaurant> findByOwnerId(Long ownerId);
}
