package com.ofos.service;

import com.ofos.model.dto.request.UserAddressRequest;
import com.ofos.model.dto.response.UserAddressResponse;
import java.util.List;

public interface UserAddressService {
    List<UserAddressResponse> getUserAddresses(Long userId);
    UserAddressResponse addAddress(Long userId, UserAddressRequest request);
    void deleteAddress(Long userId, Long addressId);
    UserAddressResponse setDefaultAddress(Long userId, Long addressId);
}
