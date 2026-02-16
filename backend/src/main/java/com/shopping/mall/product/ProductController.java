package com.shopping.mall.product;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
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
    public Page<ProductDto> getProducts (
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "LATEST") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        Sort s = mapSort(sort);
        return productService.findPage(query, page, size, s)
                .map(ProductDto::from);
    }

    private Sort mapSort(String sort) {
        return switch (sort) {
            case "PRICE_ASC" -> Sort.by(Sort.Direction.ASC, "price");
            case "PRICE_DESC" ->  Sort.by(Sort.Direction.DESC, "price");
            case "POPULAR" ->  Sort.by(Sort.Direction.DESC, "createdAt");
            default -> Sort.by(Sort.Direction.DESC, "createdAt");       // LATEST
        };
    }

    @PostMapping("/admin/products")
    public ProductDto createProduct(@RequestBody CreateProductRequest req) {
        Product p = productService.create(req.name(), req.price(), req.stock(), req.thumbnailUrl());
        return ProductDto.from(p);
    }

}
