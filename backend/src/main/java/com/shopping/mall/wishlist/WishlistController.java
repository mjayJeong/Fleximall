package com.shopping.mall.wishlist;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class WishlistController {

    private final WishlistService wishlistService;

    @PostMapping("/wishlist/{productId}/toggle")
    public WishlistToggleResponse toggle(@PathVariable Long productId) {
        return wishlistService.toggle(productId);
    }
}
