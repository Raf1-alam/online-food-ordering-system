package com.ofos.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * OrderItem — snapshot of a menu item at the time of order.
 * 
 * Stores itemName and itemPrice as copies, NOT as live references
 * to MenuItem. This ensures order history remains accurate even if
 * the restaurant later changes the menu item's price or name.
 * (Encapsulation — protecting order integrity from external mutations)
 */
@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    /**
     * Reference to the original menu item (for traceability).
     * The actual price/name used for billing is snapshotted in itemPrice/itemName.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_item_id", nullable = false)
    private MenuItem menuItem;

    /** Snapshot of item name at order time */
    @Column(nullable = false, length = 150)
    private String itemName;

    /** Snapshot of item price at order time — immutable after order creation */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal itemPrice;

    @Column(nullable = false)
    private int quantity;

    /**
     * Computes the line total for this order item.
     */
    public BigDecimal getLineTotal() {
        return itemPrice.multiply(BigDecimal.valueOf(quantity));
    }
}
