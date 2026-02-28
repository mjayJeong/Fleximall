package com.shopping.mall.order;

import java.time.LocalDateTime;
import java.util.List;

public record OrderDto (
        Long id,
        String status,
        int totalPrice,
        LocalDateTime createdAt,
        List<OrderItemDto> items
) {}