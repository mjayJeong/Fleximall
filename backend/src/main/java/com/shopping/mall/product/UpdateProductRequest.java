package com.shopping.mall.product;

public record UpdateProductRequest(
        String name,
        int price,
        int stock
) {}