package com.ofos.service.impl;

import com.ofos.exception.ResourceNotFoundException;
import com.ofos.model.dto.request.RestaurantRequest;
import com.ofos.model.dto.response.RestaurantResponse;
import com.ofos.model.entity.Restaurant;
import com.ofos.model.entity.User;
import com.ofos.model.enums.Role;
import com.ofos.repository.RestaurantRepository;
import com.ofos.repository.UserRepository;
import com.ofos.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Restaurant service implementation.
 * SRP: handles ONLY restaurant CRUD — menu management is in MenuService.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RestaurantServiceImpl implements RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<RestaurantResponse> getAllRestaurants(Pageable pageable) {
        return restaurantRepository.findByActiveTrue(pageable)
                .map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public RestaurantResponse getRestaurantById(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", id));
        return toResponse(restaurant);
    }

    @Override
    @Transactional
    @PreAuthorize("hasRole('ADMIN')")
    public RestaurantResponse createRestaurant(RestaurantRequest request) {
        User owner = userRepository.findById(request.getOwnerId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getOwnerId()));

        if (owner.getRole() != Role.RESTAURANT_STAFF && owner.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("Owner must have RESTAURANT_STAFF or ADMIN role");
        }

        Restaurant restaurant = Restaurant.builder()
                .name(request.getName())
                .description(request.getDescription())
                .address(request.getAddress())
                .phone(request.getPhone())
                .owner(owner)
                .active(true)
                .build();

        restaurant = restaurantRepository.save(restaurant);
        log.info("Restaurant created: {} (owner: {})", restaurant.getName(), owner.getEmail());
        return toResponse(restaurant);
    }

    @Override
    @Transactional
    public RestaurantResponse updateRestaurant(Long id, RestaurantRequest request, Long currentUserId) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", id));

        // IDOR protection: verify ownership unless admin
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", currentUserId));

        if (currentUser.getRole() != Role.ADMIN && !restaurant.getOwner().getId().equals(currentUserId)) {
            throw new AccessDeniedException("You can only update your own restaurant");
        }

        restaurant.setName(request.getName());
        restaurant.setDescription(request.getDescription());
        restaurant.setAddress(request.getAddress());
        restaurant.setPhone(request.getPhone());

        restaurant = restaurantRepository.save(restaurant);
        log.info("Restaurant updated: {} by user {}", restaurant.getName(), currentUser.getEmail());
        return toResponse(restaurant);
    }

    // ==================== Mapper (manual — avoids MapStruct complexity for now) ====================

    private RestaurantResponse toResponse(Restaurant restaurant) {
        return RestaurantResponse.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .description(restaurant.getDescription())
                .address(restaurant.getAddress())
                .phone(restaurant.getPhone())
                .ownerId(restaurant.getOwner().getId())
                .ownerName(restaurant.getOwner().getFullName())
                .active(restaurant.isActive())
                .menuItemCount(restaurant.getMenuItems() != null ? restaurant.getMenuItems().size() : 0)
                .createdAt(restaurant.getCreatedAt())
                .build();
    }
}
