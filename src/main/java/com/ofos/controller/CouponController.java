package com.ofos.controller;

import com.ofos.model.dto.response.ApiResponse;
import com.ofos.model.entity.Coupon;
import com.ofos.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponRepository couponRepository;

    @GetMapping("/validate/{code}")
    public ResponseEntity<ApiResponse<BigDecimal>> validateCoupon(@PathVariable String code) {
        Coupon coupon = couponRepository.findByCodeAndActiveTrue(code)
                .orElseThrow(() -> new RuntimeException("Invalid or inactive coupon"));
        
        if (coupon.getExpiryDate() != null && coupon.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Coupon has expired");
        }
        
        return ResponseEntity.ok(ApiResponse.success(coupon.getDiscountPercentage()));
    }

    @GetMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<org.springframework.data.domain.Page<Coupon>>> getAllCoupons(org.springframework.data.domain.Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(couponRepository.findAll(pageable)));
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Coupon>> createCoupon(@RequestBody Coupon coupon) {
        if (couponRepository.findByCode(coupon.getCode()).isPresent()) {
            throw new IllegalArgumentException("A coupon with this code already exists");
        }
        if (coupon.getActive() == null) {
            coupon.setActive(true);
        }
        return ResponseEntity.ok(ApiResponse.success("Coupon created", couponRepository.save(coupon)));
    }

    @PatchMapping("/{id}/toggle")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Coupon>> toggleCoupon(@PathVariable Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new com.ofos.exception.ResourceNotFoundException("Coupon", "id", id));
        coupon.setActive(!coupon.getActive());
        return ResponseEntity.ok(ApiResponse.success("Coupon status updated", couponRepository.save(coupon)));
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCoupon(@PathVariable Long id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new com.ofos.exception.ResourceNotFoundException("Coupon", "id", id));
        couponRepository.delete(coupon);
        return ResponseEntity.ok(ApiResponse.success("Coupon deleted", null));
    }
}
