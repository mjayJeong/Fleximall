package com.shopping.mall.order;

public record OrderItemDto (
        Long productId,
        String name,
        int price,
        int quantity,
        int lineTotal
) {}
