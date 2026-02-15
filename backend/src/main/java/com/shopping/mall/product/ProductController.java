package com.shopping.mall.product;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductController {

    @GetMapping("/health")
    public String health(){
        return "OK";
    }

    @GetMapping("/products")
    public List<ProductDto> getProducts() {
        return List.of(
                new ProductDto(1L, "무선 마우스", 19900, 12, "ON_SALE",
                        "https://via.placeholder.com/150"),
                new ProductDto(2L, "기계식 키보드", 89000, 5, "ON_SALE",
                        "https://via.placeholder.com/150"),
                new ProductDto(3L, "게이밍 모니터", 299000, 0, "SOLD_OUT",
                        "https://via.placeholder.com/150")
        );
    }
}
