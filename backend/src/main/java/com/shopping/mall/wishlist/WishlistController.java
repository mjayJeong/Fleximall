package com.shopping.mall.wishlist;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Wishlist API", description = "위시리스트 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class WishlistController {

    private final WishlistService wishlistService;

    @Operation(summary = "위시리스트 등록", description = "상품을 위시리스트로 등록합니다.")
    @PostMapping("/wishlist/{productId}/toggle")
    public WishlistToggleResponse toggle(@PathVariable Long productId) {
        return wishlistService.toggle(productId);
    }
}
