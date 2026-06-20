package com.ofos.service;

import com.ofos.model.dto.request.MenuItemRequest;
import com.ofos.model.dto.response.MenuItemResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Menu service interface — ISP: separate from RestaurantService.
 */
public interface MenuService {

    Page<MenuItemResponse> getMenuByRestaurant(Long restaurantId, String search, Pageable pageable);

    MenuItemResponse getMenuItemById(Long id);

    MenuItemResponse createMenuItem(Long restaurantId, MenuItemRequest request, Long currentUserId);

    MenuItemResponse updateMenuItem(Long id, MenuItemRequest request, Long currentUserId);

    void deleteMenuItem(Long id, Long currentUserId);
}
