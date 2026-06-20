package com.ofos.service;

import com.ofos.exception.ResourceNotFoundException;
import com.ofos.model.dto.request.CartItemRequest;
import com.ofos.model.dto.response.CartResponse;
import com.ofos.model.entity.Cart;
import com.ofos.model.entity.MenuItem;
import com.ofos.model.entity.Restaurant;
import com.ofos.model.entity.User;
import com.ofos.repository.CartRepository;
import com.ofos.repository.MenuItemRepository;
import com.ofos.repository.UserRepository;
import com.ofos.service.impl.CartServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceImplTest {

    @Mock
    private CartRepository cartRepository;
    @Mock
    private MenuItemRepository menuItemRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CartServiceImpl cartService;

    private User testUser;
    private Restaurant testRestaurant;
    private MenuItem testMenuItem;
    private Cart testCart;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(1L).email("test@example.com").build();
        
        testRestaurant = Restaurant.builder().id(100L).name("Test Rest").build();
        
        testMenuItem = MenuItem.builder()
                .id(200L)
                .name("Burger")
                .price(new BigDecimal("10.00"))
                .restaurant(testRestaurant)
                .available(true)
                .build();

        testCart = Cart.builder().id(10L).user(testUser).build();
    }

    @Test
    @DisplayName("Should successfully add an available item to the cart")
    void addItem_Success() {
        // Arrange
        CartItemRequest request = new CartItemRequest(200L, 2);
        
        when(cartRepository.findByUserIdWithItems(1L)).thenReturn(Optional.of(testCart));
        when(menuItemRepository.findById(200L)).thenReturn(Optional.of(testMenuItem));
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);

        // Act
        CartResponse response = cartService.addItem(1L, request);

        // Assert
        assertNotNull(response);
        assertEquals(1, testCart.getItems().size());
        assertEquals(2, testCart.getItems().get(0).getQuantity());
        verify(cartRepository).save(testCart);
    }

    @Test
    @DisplayName("Should throw exception if menu item is unavailable")
    void addItem_UnavailableItem_ThrowsException() {
        // Arrange
        CartItemRequest request = new CartItemRequest(200L, 1);
        testMenuItem.setAvailable(false); // Make unavailable
        
        when(cartRepository.findByUserIdWithItems(1L)).thenReturn(Optional.of(testCart));
        when(menuItemRepository.findById(200L)).thenReturn(Optional.of(testMenuItem));

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            cartService.addItem(1L, request);
        });
        
        assertEquals("Menu item is currently unavailable", exception.getMessage());
        verify(cartRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should clear all items from cart")
    void clearCart_Success() {
        // Arrange
        testCart.addItem(testMenuItem, 1);
        assertEquals(1, testCart.getItems().size());

        when(cartRepository.findByUserIdWithItems(1L)).thenReturn(Optional.of(testCart));
        when(cartRepository.save(any(Cart.class))).thenReturn(testCart);

        // Act
        CartResponse response = cartService.clearCart(1L);

        // Assert
        assertNotNull(response);
        assertEquals(0, testCart.getItems().size()); // Cart should be empty now
        verify(cartRepository).save(testCart);
    }
}
