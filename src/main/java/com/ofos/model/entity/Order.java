package com.ofos.model.entity;

import com.ofos.model.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Order entity with optimistic locking (@Version) for concurrent access safety.
 * 
 * Order status transitions are managed by the State design pattern — 
 * the Order entity delegates state logic to OrderState implementations
 * rather than containing if/else chains (SRP + OCP).
 */
@Entity
@Table(name = "orders", indexes = {
        @Index(name = "idx_order_user", columnList = "user_id"),
        @Index(name = "idx_order_restaurant", columnList = "restaurant_id"),
        @Index(name = "idx_order_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurant_id", nullable = false)
    private Restaurant restaurant;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "discount_amount", precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_id")
    private Coupon coupon;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrderStatus status;

    @Column(length = 500)
    private String deliveryAddress;

    /**
     * Estimated delivery time, set by restaurant staff when confirming the order.
     * Displayed to customers on the Orders page so they know when to expect delivery.
     */
    @Column(name = "estimated_delivery_time")
    private LocalDateTime estimatedDeliveryTime;

    /**
     * Optimistic locking — prevents concurrent status updates from corrupting data.
     * Satisfies the "50 concurrent users" requirement.
     */
    @Version
    private int version;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // ==================== Domain Behavior ====================

    /**
     * Adds an order item (price snapshot) to this order.
     * Used by OrderFactory during order assembly.
     */
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }
}
