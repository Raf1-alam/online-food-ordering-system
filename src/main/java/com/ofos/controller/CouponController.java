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
}
