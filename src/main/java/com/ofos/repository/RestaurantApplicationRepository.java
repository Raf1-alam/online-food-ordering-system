package com.ofos.repository;

import com.ofos.model.entity.RestaurantApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RestaurantApplicationRepository extends JpaRepository<RestaurantApplication, Long> {
    Page<RestaurantApplication> findAll(Pageable pageable);
    Optional<RestaurantApplication> findByUserId(Long userId);
}
