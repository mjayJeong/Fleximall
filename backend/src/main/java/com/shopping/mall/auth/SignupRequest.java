package com.shopping.mall.auth;

public record SignupRequest(String email, String password, String role) {
}
