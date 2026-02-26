package com.shopping.mall.cart;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserId(Long userId);
    Optional<CartItem> findByIdAndUserIdAndProduct_Id(Long userId, Long productId);
    void deleteByUserIdAndProduct_Id(Long userId, Long productId);
}
