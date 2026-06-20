package com.ofos.repository;

import com.ofos.model.entity.Order;
import com.ofos.model.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {

    Page<Order> findByUserId(Long userId, Pageable pageable);

    Page<Order> findByRestaurantId(Long restaurantId, Pageable pageable);

    Page<Order> findByRestaurantIdAndStatus(Long restaurantId, OrderStatus status, Pageable pageable);
}
