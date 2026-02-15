package com.shopping.mall.product;

public record ProductDto (
    Long id,
    String name,
    int price,
    int stock,
    String status,
    String thumbnailUrl
) {}