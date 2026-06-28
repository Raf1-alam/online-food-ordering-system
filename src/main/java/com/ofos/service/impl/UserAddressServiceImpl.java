package com.ofos.service.impl;

import com.ofos.exception.ResourceNotFoundException;
import com.ofos.model.dto.request.UserAddressRequest;
import com.ofos.model.dto.response.UserAddressResponse;
import com.ofos.model.entity.User;
import com.ofos.model.entity.UserAddress;
import com.ofos.repository.UserAddressRepository;
import com.ofos.repository.UserRepository;
import com.ofos.service.UserAddressService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserAddressServiceImpl implements UserAddressService {

    private final UserAddressRepository addressRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<UserAddressResponse> getUserAddresses(Long userId) {
        return addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserAddressResponse addAddress(Long userId, UserAddressRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        long count = addressRepository.countByUserId(userId);
        if (count >= 5) {
            throw new IllegalArgumentException("Maximum of 5 addresses allowed. Please delete an existing one.");
        }

        // If it's the first address, make it default automatically
        boolean isDefault = count == 0 || request.isDefault();

        if (isDefault) {
            clearOtherDefaults(userId);
        }

        UserAddress address = UserAddress.builder()
                .user(user)
                .label(request.getLabel())
                .fullAddress(request.getFullAddress())
                .isDefault(isDefault)
                .build();

        address = addressRepository.save(address);
        log.info("Address '{}' added for user {}", address.getLabel(), userId);
        return toResponse(address);
    }

    @Override
    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        UserAddress address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", addressId));
        
        boolean wasDefault = address.isDefault();
        addressRepository.delete(address);
        
        if (wasDefault) {
            // Assign another address as default if available
            List<UserAddress> remaining = addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId);
            if (!remaining.isEmpty()) {
                UserAddress newDefault = remaining.get(0);
                newDefault.setDefault(true);
                addressRepository.save(newDefault);
            }
        }
        log.info("Address ID {} deleted for user {}", addressId, userId);
    }

    @Override
    @Transactional
    public UserAddressResponse setDefaultAddress(Long userId, Long addressId) {
        UserAddress address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", addressId));

        if (!address.isDefault()) {
            clearOtherDefaults(userId);
            address.setDefault(true);
            address = addressRepository.save(address);
        }

        return toResponse(address);
    }

    private void clearOtherDefaults(Long userId) {
        List<UserAddress> addresses = addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId);
        for (UserAddress addr : addresses) {
            if (addr.isDefault()) {
                addr.setDefault(false);
                addressRepository.save(addr);
            }
        }
    }

    private UserAddressResponse toResponse(UserAddress address) {
        return UserAddressResponse.builder()
                .id(address.getId())
                .label(address.getLabel())
                .fullAddress(address.getFullAddress())
                .isDefault(address.isDefault())
                .createdAt(address.getCreatedAt())
                .build();
    }
}
