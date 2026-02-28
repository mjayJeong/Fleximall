package com.shopping.mall.admin;

import com.shopping.mall.order.OrderRepository;
import com.shopping.mall.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminDashboardService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public AdminDashboardDto getDashboard() {
        // 오늘 00:00 ~ 내일 00:00
        LocalDate today =  LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = start.plusDays(1);

        long orderCount = orderRepository.countOrdersBetween(start, end);
        long revenue = orderRepository.sumRevenueBetween(start, end);

        var lowStock = productRepository.findTop5ByOrderByStockAsc().stream()
                .map(p -> new AdminDashboardDto.LowStockProductDto(
                        p.getId(),
                        p.getName(),
                        p.getStock(),
                        p.getStatus().name()
                ))
                .toList();

        return new AdminDashboardDto(orderCount, revenue, lowStock);
    }
}
