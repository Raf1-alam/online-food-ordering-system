package com.ofos.model.entity;

import com.ofos.model.enums.PaymentMethod;
import com.ofos.model.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Payment entity linked one-to-one with an Order.
 * Payment method selection is resolved at runtime by the Strategy pattern.
 * Amount is always computed server-side — never accepted from the client.
 */
@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentMethod method;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentStatus status;

    /** Unique reference from the payment gateway (mocked) */
    @Column(length = 100)
    private String transactionRef;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime paidAt;
}
