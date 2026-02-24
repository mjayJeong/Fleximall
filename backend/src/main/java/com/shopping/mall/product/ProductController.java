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
        return productService.findPage(query, page, size, sort)
                .map(ProductDto::from);
    }

    @PostMapping("/admin/products")
    public ProductDto createProduct(@RequestBody CreateProductRequest req) {
        Product p = productService.create(req.name(), req.price(), req.stock(), req.thumbnailUrl());
        return ProductDto.from(p);
    }

}
