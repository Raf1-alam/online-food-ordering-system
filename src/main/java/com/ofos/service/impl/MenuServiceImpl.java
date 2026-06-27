package com.ofos.service.impl;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.ofos.exception.ResourceNotFoundException;
import com.ofos.model.dto.request.MenuItemRequest;
import com.ofos.model.dto.response.MenuItemResponse;
import com.ofos.model.entity.MenuItem;
import com.ofos.model.entity.Restaurant;
import com.ofos.repository.MenuItemRepository;
import com.ofos.repository.RestaurantRepository;
import com.ofos.service.MenuService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Slf4j
public class MenuServiceImpl implements MenuService {

    private final MenuItemRepository menuItemRepository;
    private final RestaurantRepository restaurantRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<MenuItemResponse> getMenuByRestaurant(Long restaurantId, String search, Pageable pageable) {
        if (StringUtils.hasText(search)) {
            return menuItemRepository.searchByRestaurant(restaurantId, search, pageable)
                    .map(this::toResponse);
        }
        return menuItemRepository.findByRestaurantIdAndAvailableTrue(restaurantId, pageable)
                .map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public MenuItemResponse getMenuItemById(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", id));
        return toResponse(item);
    }

    @Override
    @Transactional
    public MenuItemResponse createMenuItem(Long restaurantId, MenuItemRequest request, Long currentUserId) {
        Restaurant restaurant = getRestaurantWithOwnerCheck(restaurantId, currentUserId);

        MenuItem item = MenuItem.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .available(request.getAvailable() != null ? request.getAvailable() : true)
                .imageUrl(request.getImageUrl())
                .restaurant(restaurant)
                .build();

        item = menuItemRepository.save(item);
        log.info("Menu item created: {} in restaurant {}", item.getName(), restaurant.getName());
        return toResponse(item);
    }

    @Override
    @Transactional
    public MenuItemResponse updateMenuItem(Long id, MenuItemRequest request, Long currentUserId) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", id));

        // IDOR protection
        verifyOwnership(item.getRestaurant(), currentUserId);

        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setCategory(request.getCategory());
        if (request.getAvailable() != null) {
            item.setAvailable(request.getAvailable());
        }
        if (request.getImageUrl() != null) {
            item.setImageUrl(request.getImageUrl());
        }

        item = menuItemRepository.save(item);
        log.info("Menu item updated: {}", item.getName());
        return toResponse(item);
    }

    @Override
    @Transactional
    public void deleteMenuItem(Long id, Long currentUserId) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MenuItem", "id", id));

        // IDOR protection
        verifyOwnership(item.getRestaurant(), currentUserId);

        // Soft delete — preserve order history integrity
        item.setAvailable(false);
        menuItemRepository.save(item);
        log.info("Menu item soft-deleted: {}", item.getName());
    }

    // ==================== Helpers ====================

    private Restaurant getRestaurantWithOwnerCheck(Long restaurantId, Long currentUserId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", restaurantId));
        verifyOwnership(restaurant, currentUserId);
        return restaurant;
    }

    /**
     * IDOR protection — staff can only manage their own restaurant's menu.
     */
    private void verifyOwnership(Restaurant restaurant, Long currentUserId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (isAdmin) {
            return;
        }

        if (!restaurant.getOwner().getId().equals(currentUserId)) {
            throw new AccessDeniedException("You can only manage your own restaurant's menu");
        }
    }

    private MenuItemResponse toResponse(MenuItem item) {
        return MenuItemResponse.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .category(item.getCategory())
                .available(item.isAvailable())
                .imageUrl(item.getImageUrl())
                .restaurantId(item.getRestaurant().getId())
                .restaurantName(item.getRestaurant().getName())
                .build();
    }
}
