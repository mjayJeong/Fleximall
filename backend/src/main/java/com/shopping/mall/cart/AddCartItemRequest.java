package com.shopping.mall.cart;

public record AddCartItemRequest (
        Long productId,
        int quantity
) {}
