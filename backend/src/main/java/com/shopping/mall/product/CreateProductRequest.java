package com.shopping.mall.product;

public record CreateProductRequest (
    String name,
    int price,
    int stock
) {}
