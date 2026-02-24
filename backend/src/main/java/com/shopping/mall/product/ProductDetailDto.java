package com.shopping.mall.product;

public record ProductDetailDto (
    Long id,
    String name,
    int price,
    int stock,
    String status,
    String thumbnailUrl,
    long wishCount,
    boolean wished
) {}
