package com.shopping.mall.auth;

import org.springframework.security.core.context.SecurityContextHolder;

public class AuthContext {

    public static Long userId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) throw new IllegalStateException("unauthorized");
        return ((AuthUser) auth.getPrincipal()).userId();
    }

    public static String role() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        return ((AuthUser) auth.getPrincipal()).role();
    }
}
