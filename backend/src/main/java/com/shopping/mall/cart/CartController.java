package com.shopping.mall.cart;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class CartController {

    private final CartService cartService;

    @GetMapping("/cart")
    public List<CartItemDto> getCart() {
        return cartService.getMyCart();
    }

    @PostMapping("/cart/items")
    public void addItem(@RequestBody AddCartItemRequest req) {
        cartService.addToCart(req.productId(), req.quantity());
    }

    @PatchMapping("/cart/items/{productId}")
    public void updateQty(@PathVariable Long productId, @RequestBody UpdateCartItemRequest req) {
        cartService.updateQuantity(productId, req.quantity());
    }

    @DeleteMapping("/cart/items/{productId}")
    public void remove(@PathVariable Long productId) {
        cartService.remove(productId);
    }
}
