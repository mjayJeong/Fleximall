package com.shopping.mall.cart;

public record CartItemDto (
        Long productId,
        String name,
        int price,
        String thumbnailUrl,
        int stock,
        String status,
        int quantity,
        int lineTotal
) {}
