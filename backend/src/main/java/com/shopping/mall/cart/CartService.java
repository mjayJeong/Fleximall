package com.shopping.mall.cart;

import com.shopping.mall.product.Product;
import com.shopping.mall.product.ProductRepository;
import com.shopping.mall.product.ProductStatus;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    private static final Long DEMO_USER_ID = 1L;

    @Transactional(readOnly = true)
    public List<CartItemDto> getMyCart() {
        return cartItemRepository.findByUserId(DEMO_USER_ID).stream()
                .map(ci -> {
                    Product p = ci.getProduct();
                    return new CartItemDto(
                            p.getId(),
                            p.getName(),
                            p.getPrice(),
                            p.getThumbnailUrl(),
                            p.getStock(),
                            p.getStatus().name(),
                            ci.getQuantity(),
                            p.getPrice() * ci.getQuantity()
                    );
                })
                .toList();
    }

    public void addToCart(Long productId, int quantity) {
        if (quantity <= 0) throw new IllegalArgumentException("quantity must be greater than zero");

        Product p = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("product not found"));

        if (p.getStatus() == ProductStatus.SOLD_OUT || p.getStock() <= 0) {
            throw new IllegalArgumentException("sold out");
        }

        CartItem item = cartItemRepository.findByIdAndUserIdAndProduct_Id(DEMO_USER_ID, productId)
                .orElse(null);

        if (item == null) {
            cartItemRepository.save(CartItem.builder()
                    .userId(DEMO_USER_ID)
                    .product(p)
                    .quantity(quantity)
                    .build());
        } else {
            item.increase(quantity);
        }
    }

    public void updateQuantity(Long productId, int quantity) {
        if (quantity <= 0) {
            // 0 이하면 삭제로 처리
            cartItemRepository.deleteByUserIdAndProduct_Id(DEMO_USER_ID, productId);
            return;
        }

        CartItem item = cartItemRepository.findByIdAndUserIdAndProduct_Id(DEMO_USER_ID, productId)
                .orElseThrow(() -> new IllegalArgumentException("cart item not found"));

        item.changeQuantity(quantity);
    }

    public void remove(Long productId) {
        cartItemRepository.deleteByUserIdAndProduct_Id(DEMO_USER_ID, productId);
    }
}

