package com.shopping.mall.product;

import jakarta.transaction.Transactional;
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

    public Page<Product> findPage(String query, int page, int size, Sort sort) {
        Pageable pageable = PageRequest.of(page, size, sort);

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
                .thumbnailUrl(thumbnailUrl)
                .status(ProductStatus.ON_SALE)      // 초기에는 ON_SALE 상태로
                .stock(stock)
                .build();

        product.changeStock(stock);
        return productRepository.save(product);
    }
}
