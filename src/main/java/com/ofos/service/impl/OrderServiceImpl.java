package com.ofos.service.impl;

import com.ofos.exception.ResourceNotFoundException;
import com.ofos.model.dto.request.OrderRequest;
import com.ofos.model.dto.request.OrderStatusUpdateRequest;
import com.ofos.model.dto.response.OrderResponse;
import com.ofos.model.entity.*;
import com.ofos.model.enums.OrderStatus;
import com.ofos.model.enums.PaymentStatus;
import com.ofos.model.enums.Role;
import com.ofos.pattern.factory.OrderFactory;
import com.ofos.pattern.factory.PaymentStrategyFactory;
import com.ofos.pattern.state.OrderState;
import com.ofos.pattern.state.OrderStateFactory;
import com.ofos.pattern.strategy.PaymentResult;
import com.ofos.pattern.strategy.PaymentStrategy;
import com.ofos.repository.*;
import com.ofos.service.CartService;
import com.ofos.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Order service tying together State, Strategy, and Factory patterns.
 * 
 * Demonstrates:
 * 1. Transactional boundary enforcement (order + payment in one transaction)
 * 2. IDOR protection (ownership validation for customers and staff)
 * 3. Optimistic locking (@Version on Order prevents concurrent state modification)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final CouponRepository couponRepository;
    
    // Pattern components
    private final OrderFactory orderFactory;
    private final OrderStateFactory stateFactory;
    private final PaymentStrategyFactory paymentStrategyFactory;
    private final CartService cartService;

    @Override
    @Transactional
    public OrderResponse placeOrder(Long customerId, OrderRequest request) {
        Cart cart = cartRepository.findByUserIdWithItems(customerId)
                .orElseThrow(() -> new IllegalArgumentException("Cart is empty"));

        if (cart.isEmpty()) {
            throw new IllegalArgumentException("Cannot place an order with an empty cart");
        }

        User customer = cart.getUser();
        Restaurant restaurant = cart.getItems().get(0).getMenuItem().getRestaurant();

        // 1. Factory Pattern: assemble order with price snapshots
        Order order = orderFactory.createOrder(customer, restaurant, cart.getItems(), request.getDeliveryAddress());

        // Process coupon
        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            Coupon coupon = couponRepository.findByCodeAndActiveTrue(request.getCouponCode())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid or inactive coupon"));
            
            if (coupon.getExpiryDate() != null && coupon.getExpiryDate().isBefore(java.time.LocalDateTime.now())) {
                throw new IllegalArgumentException("Coupon has expired");
            }
            
            java.math.BigDecimal subTotal = order.getTotalAmount();
            java.math.BigDecimal discountPercentage = coupon.getDiscountPercentage();
            java.math.BigDecimal discountAmount = subTotal.multiply(discountPercentage).divide(new java.math.BigDecimal("100"), 2, java.math.RoundingMode.HALF_UP);
            java.math.BigDecimal finalTotal = subTotal.subtract(discountAmount);
            
            order.setCoupon(coupon);
            order.setDiscountAmount(discountAmount);
            order.setTotalAmount(finalTotal);
        }

        order = orderRepository.save(order);

        // 2. Strategy Pattern: process payment based on selected method
        PaymentStrategy paymentStrategy = paymentStrategyFactory.getStrategy(request.getPaymentMethod());
        PaymentResult paymentResult = paymentStrategy.processPayment(order.getTotalAmount(), order.getId());

        Payment payment = Payment.builder()
                .order(order)
                .amount(order.getTotalAmount())
                .method(request.getPaymentMethod())
                .status(paymentResult.getStatus())
                .transactionRef(paymentResult.getTransactionRef())
                .build();
        paymentRepository.save(payment);

        // 3. Clear the cart
        cartService.clearCart(customerId);

        log.info("Order #{} placed successfully by user {} via {}", 
                 order.getId(), customer.getEmail(), request.getPaymentMethod());

        return toResponse(order, payment);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long orderId, Long currentUserId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        verifyOrderAccess(order, currentUserId);

        Payment payment = paymentRepository.findByOrderId(order.getId()).orElse(null);
        return toResponse(order, payment);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> getCustomerOrders(Long customerId, Pageable pageable) {
        return orderRepository.findByUserId(customerId, pageable)
                .map(order -> toResponse(order, paymentRepository.findByOrderId(order.getId()).orElse(null)));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderResponse> getRestaurantOrders(Long restaurantId, Long staffId, Pageable pageable) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", restaurantId));

        User staff = userRepository.findById(staffId).orElseThrow();
        if (staff.getRole() != Role.ADMIN && !restaurant.getOwner().getId().equals(staffId)) {
            throw new AccessDeniedException("You don't have permission to view this restaurant's orders");
        }

        return orderRepository.findByRestaurantId(restaurantId, pageable)
                .map(order -> toResponse(order, paymentRepository.findByOrderId(order.getId()).orElse(null)));
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatusUpdateRequest request, Long staffId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        User staff = userRepository.findById(staffId).orElseThrow();
        if (staff.getRole() != Role.ADMIN && !order.getRestaurant().getOwner().getId().equals(staffId)) {
            throw new AccessDeniedException("You don't have permission to update this order");
        }

        // State Pattern: load current state, attempt transition, set new status
        OrderState currentState = stateFactory.getState(order.getStatus());
        
        if (!currentState.canTransitionTo(request.getStatus())) {
            throw new com.ofos.exception.InvalidStateTransitionException(
                    currentState.getStatus().name(), request.getStatus().name());
        }

        // Advance state machine
        while (order.getStatus() != request.getStatus()) {
            currentState = currentState.next(order);
        }

        order = orderRepository.save(order);
        log.info("Order #{} status updated to {} by staff {}", order.getId(), order.getStatus(), staff.getEmail());

        Payment payment = paymentRepository.findByOrderId(order.getId()).orElse(null);
        return toResponse(order, payment);
    }

    @Override
    @Transactional
    public OrderResponse cancelOrder(Long orderId, Long currentUserId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        verifyOrderAccess(order, currentUserId);

        // State Pattern: attempt cancellation
        OrderState currentState = stateFactory.getState(order.getStatus());
        currentState.cancel(order); // Will throw exception if cancellation is invalid

        order = orderRepository.save(order);
        log.info("Order #{} cancelled by user {}", order.getId(), currentUserId);

        // Process refund logic (mocked)
        Payment payment = paymentRepository.findByOrderId(order.getId()).orElse(null);
        if (payment != null && payment.getStatus() == PaymentStatus.COMPLETED) {
            payment.setStatus(PaymentStatus.REFUNDED);
            paymentRepository.save(payment);
            log.info("Payment for order #{} marked as refunded", order.getId());
        }

        return toResponse(order, payment);
    }

    // ==================== Helpers ====================

    private void verifyOrderAccess(Order order, Long currentUserId) {
        User currentUser = userRepository.findById(currentUserId).orElseThrow();
        
        if (currentUser.getRole() == Role.ADMIN) return;
        
        boolean isCustomer = order.getUser().getId().equals(currentUserId);
        boolean isRestaurantStaff = order.getRestaurant().getOwner().getId().equals(currentUserId);

        if (!isCustomer && !isRestaurantStaff) {
            throw new AccessDeniedException("You don't have permission to view this order");
        }
    }

    private OrderResponse toResponse(Order order, Payment payment) {
        List<OrderResponse.OrderItemResponse> itemResponses = order.getItems().stream()
                .map(item -> OrderResponse.OrderItemResponse.builder()
                        .id(item.getId())
                        .itemName(item.getItemName())
                        .itemPrice(item.getItemPrice())
                        .quantity(item.getQuantity())
                        .lineTotal(item.getLineTotal())
                        .build())
                .collect(Collectors.toList());

        OrderResponse.PaymentInfo paymentInfo = payment == null ? null :
                OrderResponse.PaymentInfo.builder()
                        .method(payment.getMethod())
                        .status(payment.getStatus())
                        .transactionRef(payment.getTransactionRef())
                        .paidAt(payment.getPaidAt())
                        .build();

        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .customerName(order.getUser().getFullName())
                .restaurantId(order.getRestaurant().getId())
                .restaurantName(order.getRestaurant().getName())
                .items(itemResponses)
                .totalAmount(order.getTotalAmount())
                .discountAmount(order.getDiscountAmount())
                .couponCode(order.getCoupon() != null ? order.getCoupon().getCode() : null)
                .status(order.getStatus())
                .deliveryAddress(order.getDeliveryAddress())
                .payment(paymentInfo)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
