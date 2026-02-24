package com.shopping.mall.product;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Product API", description = "상품 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ProductController {

    private final ProductService productService;

    @Operation(summary = "테스트", description = "테스트 용도")
    @GetMapping("/health")
    public String health(){
        return "OK";
    }

    @Operation(summary = "상품 리스트 조회", description = "상품의 리스트를 조회합니다.")
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

    @Operation(summary = "상품 등록", description = "상품을 등록합니다.")
    @PostMapping("/admin/products")
    public ProductDto createProduct(@RequestBody CreateProductRequest req) {
        Product p = productService.create(req.name(), req.price(), req.stock(), req.thumbnailUrl());
        return ProductDto.from(p);
    }

    @Operation(summary = "상품 상세 조회", description = "상품의 상세 정보를 조회합니다.")
    @GetMapping("/products/{id}")
    public ProductDetailDto getProductDetail(@PathVariable Long id) {
        return productService.getDetail(id);
    }
}
