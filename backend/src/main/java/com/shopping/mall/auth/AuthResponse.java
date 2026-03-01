package com.shopping.mall.auth;

public record AuthResponse(String accessToken, Long userId, String role) {
}
