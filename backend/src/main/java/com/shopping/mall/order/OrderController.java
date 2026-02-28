package com.shopping.mall.order;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/orders")
    public OrderDto createOrder() {
        return orderService.createOrderFromCart();
    }

    @GetMapping("/orders")
    public List<OrderDto> myOrders() {
        return orderService.getMyOrders();
    }
}
