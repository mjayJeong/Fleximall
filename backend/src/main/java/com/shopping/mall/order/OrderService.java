package com.shopping.mall.order;

import com.shopping.mall.cart.CartItem;
import com.shopping.mall.cart.CartItemRepository;
import com.shopping.mall.product.Product;
import com.shopping.mall.product.ProductRepository;
import com.shopping.mall.product.ProductStatus;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    private static final Long DEMO_USER_ID = 1L;

    public OrderDto createOrderFromCart() {
        List<CartItem> cartItems = cartItemRepository.findByUserId(DEMO_USER_ID);
        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("cart is empty");
        }

        // 1. 재고 체크
        for (CartItem ci : cartItems) {
            Product p = ci.getProduct();
            if (p.getStatus() == ProductStatus.SOLD_OUT || p.getStock() <= 0) {
                throw new IllegalArgumentException("sold out : " + p.getName());
            }
            if (ci.getQuantity() > p.getStock()) {
                throw new IllegalArgumentException("not enough stock : " + p.getName());
            }
        }

        // 2. 주문 생성
        Order order = Order.builder()
                .userId(DEMO_USER_ID)
                .status(OrderStatus.PAID)
                .totalPrice(0)
                .build();

        int total = 0;

        for (CartItem ci : cartItems) {
            Product p = ci.getProduct();

            int priceSnapshot = p.getPrice();
            int qty = ci.getQuantity();
            total += priceSnapshot * qty;

            // 재고 차감 + 품절 자동 처리
            p.changeStock(p.getStock() - qty);

            OrderItem item = OrderItem.builder()
                    .product(p)
                    .price(priceSnapshot)
                    .quantity(qty)
                    .build();

            order.addItem(item);
        }

        order.setTotalPrice(total);

        // 3. 저장
        Order saved =  orderRepository.save(order);

        // 4. 장바구니 비우기
        cartItemRepository.deleteAll(cartItems);

        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getMyOrders() {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(DEMO_USER_ID).stream()
                .map(this::toDto)
                .toList();
    }

    private OrderDto toDto(Order o) {
        var items = o.getItems().stream()
                .map(oi -> new OrderItemDto(
                        oi.getProduct().getId(),
                        oi.getProduct().getName(),
                        oi.getPrice(),
                        oi.getQuantity(),
                        oi.getPrice() * oi.getQuantity()
                ))
                .toList();

        return new OrderDto(
                o.getId(),
                o.getStatus().name(),
                o.getTotalPrice(),
                o.getCreatedAt(),
                items
        );
    }
}
