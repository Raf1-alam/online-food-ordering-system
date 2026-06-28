package com.ofos.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.Formula;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Restaurant entity owned by a User with RESTAURANT_STAFF role.
 * Ownership is enforced at the service layer to prevent IDOR attacks.
 */
@Entity
@Table(name = "restaurants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false, length = 300)
    private String address;

    @Column(length = 20)
    private String phone;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "opening_time", length = 5)
    private String openingTime;

    @Column(name = "closing_time", length = 5)
    private String closingTime;

    /**
     * The staff user who owns/manages this restaurant.
     * Used for ownership-based access control (IDOR prevention).
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    @Formula("(SELECT COALESCE(AVG(r.rating), 0.0) FROM reviews r WHERE r.restaurant_id = id)")
    private Double rating;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MenuItem> menuItems = new ArrayList<>();

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Transient
    public boolean isCurrentlyOpen() {
        if (openingTime == null || closingTime == null || openingTime.isEmpty() || closingTime.isEmpty()) {
            return true;
        }
        try {
            java.time.LocalTime now = java.time.LocalTime.now();
            java.time.LocalTime open = java.time.LocalTime.parse(openingTime);
            java.time.LocalTime close = java.time.LocalTime.parse(closingTime);
            if (close.isBefore(open)) {
                return !now.isBefore(open) || !now.isAfter(close);
            } else {
                return !now.isBefore(open) && !now.isAfter(close);
            }
        } catch (Exception e) {
            return true;
        }
    }
}
