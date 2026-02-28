package com.shopping.mall.admin;

import java.util.List;

public record AdminDashboardDto(
        long todayOrderCount,
        long todayRevenue,
        List<LowStockProductDto> lowStockTop5
) {
    public record LowStockProductDto(
            Long id,
            String name,
            int stock,
            String status
    ) {}
}
