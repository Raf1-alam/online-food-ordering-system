package com.ofos.service;

import com.ofos.model.dto.request.OrderRequest;
import com.ofos.model.dto.request.OrderStatusUpdateRequest;
import com.ofos.model.dto.response.OrderResponse;
import com.ofos.model.dto.response.CartResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {

    OrderResponse placeOrder(Long customerId, OrderRequest request);

    OrderResponse getOrderById(Long orderId, Long currentUserId);

    Page<OrderResponse> getCustomerOrders(Long customerId, Pageable pageable);

    Page<OrderResponse> getRestaurantOrders(Long restaurantId, Long staffId, Pageable pageable);

    OrderResponse updateOrderStatus(Long orderId, OrderStatusUpdateRequest request, Long staffId);

    OrderResponse cancelOrder(Long orderId, Long currentUserId);

    CartResponse reorder(Long orderId, Long currentUserId);
}
