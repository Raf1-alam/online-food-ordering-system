package com.ofos.repository;

import com.ofos.model.entity.Payment;
import com.ofos.model.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long>, JpaSpecificationExecutor<Payment> {

    Optional<Payment> findByOrderId(Long orderId);

    boolean existsByOrderIdAndStatusIn(Long orderId, java.util.List<PaymentStatus> statuses);

    Page<Payment> findAll(Pageable pageable);
}
