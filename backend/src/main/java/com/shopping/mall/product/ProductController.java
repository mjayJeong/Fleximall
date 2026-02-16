package com.shopping.mall.product;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ProductController {

    private final ProductService productService;

    @GetMapping("/health")
    public String health(){
        return "OK";
    }

    @GetMapping("/products")
    public List<ProductDto> getProducts() {
        return productService.findAll().stream()
                .map(ProductDto::from)
                .toList();
    }

    @PostMapping("/admin/products")
    public ProductDto createProduct(@RequestBody CreateProductRequest req) {
        Product p = productService.create(req.name(), req.price(), req.stock(), req.thumbnailUrl());
        return ProductDto.from(p);
    }

}
