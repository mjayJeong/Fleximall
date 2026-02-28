package com.shopping.mall.order;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin")
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping("/orders")
    public Page<OrderDto> allOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return orderService.getAllOrders(page, size);
    }

    @PatchMapping("/orders/{id}/status")
    public OrderDto updateStatus(@PathVariable Long id, @RequestBody AdminUpdateOrderStatusRequest req) {
        return orderService.adminUpdateStatus(id, req.status());
    }
}
