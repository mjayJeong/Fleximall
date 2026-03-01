package com.shopping.mall.wishlist;

import com.shopping.mall.auth.AuthContext;
import com.shopping.mall.product.Product;
import com.shopping.mall.product.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;

    public WishlistToggleResponse toggle(Long productId) {
        Long uid = AuthContext.userId();
        var existing = wishlistRepository.findByUserIdAndProduct_Id(uid, productId);
        if (existing.isPresent()) {
            wishlistRepository.delete(existing.get());
            return new WishlistToggleResponse(false);
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("product not found"));

        wishlistRepository.save(Wishlist.builder()
                .userId(uid)
                .product(product)
                .build());

        return new WishlistToggleResponse(true);
    }

    public boolean isWished(Long productId) {
        Long uid = AuthContext.userId();
        return wishlistRepository.existsByUserIdAndProduct_Id(uid, productId);
    }

}
