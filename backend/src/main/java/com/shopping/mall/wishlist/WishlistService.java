package com.shopping.mall.wishlist;

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

    private static final Long DEMO_USER_ID = 1L;

    public WishlistToggleResponse toggle(Long productId) {
        var existing = wishlistRepository.findByUserIdAndProduct_Id(DEMO_USER_ID, productId);
        if (existing.isPresent()) {
            wishlistRepository.delete(existing.get());
            return new WishlistToggleResponse(false);
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("product not found"));

        wishlistRepository.save(Wishlist.builder()
                .userId(DEMO_USER_ID)
                .product(product)
                .build());

        return new WishlistToggleResponse(true);
    }

    public boolean isWished(Long productId) {
        return wishlistRepository.existsByUserIdAndProduct_Id(DEMO_USER_ID, productId);
    }

}
