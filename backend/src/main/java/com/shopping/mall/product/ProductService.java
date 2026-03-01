package com.shopping.mall.product;

import com.shopping.mall.auth.AuthContext;
import com.shopping.mall.wishlist.WishlistRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final WishlistRepository wishlistRepository;

    public Page<Product> findPage(String query, int page, int size, String sortKey) {
        Pageable pageable;

        if ("POPULAR".equals(sortKey)) {
            pageable = PageRequest.of(page, size);
            if (query == null || query.isBlank()) {
                return productRepository.findAllOrderByPopular(pageable);
            }
            return productRepository.findByNameOrderByPopular(query.trim(), pageable);
        }

        Sort sort = switch (sortKey) {
            case "PRICE_ASC" -> Sort.by(Sort.Direction.ASC, "price");
            case "PRICE_DESC" -> Sort.by(Sort.Direction.DESC, "price");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");
        };

        pageable = PageRequest.of(page, size, sort);

        if (query == null || query.isBlank()) {
            return productRepository.findAll(pageable);
        }
        return productRepository.findByNameContainingIgnoreCase(query.trim(), pageable);
    }

//    public List<Product> findAll() {
//        return productRepository.findAll();
//    }

    public Product create(String name, int price, int stock, String thumbnailUrl) {
        Product product = Product.builder()
                .name(name)
                .price(price)
                .thumbnailUrl("/uploads/placeholder.png")
                .status(ProductStatus.ON_SALE)      // 초기에는 ON_SALE 상태로
                .stock(stock)
                .build();

        product.changeStock(stock);
        return productRepository.save(product);
    }

    @Transactional(readOnly = true)
    public ProductDetailDto getDetail(Long id) {
        Long uid = AuthContext.userId();
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("product not found"));

        long wishCount = wishlistRepository.countByProduct_Id(id);
        boolean wished = wishlistRepository.existsByUserIdAndProduct_Id(uid, id);

        return new ProductDetailDto(
                p.getId(),
                p.getName(),
                p.getPrice(),
                p.getStock(),
                p.getStatus().name(),
                p.getThumbnailUrl(),
                wishCount,
                wished
        );
    }
}
