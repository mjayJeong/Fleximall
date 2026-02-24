package com.shopping.mall.wishlist;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    Optional<Wishlist> findByUserIdAndProduct_Id(Long userId, Long productId);
    long countByProduct_Id(Long productId);
    boolean existsByUserIdAndProduct_Id(Long userId, Long productId);
}
