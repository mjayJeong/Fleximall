package com.shopping.mall.auth;

import io.jsonwebtoken.Claims;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {

        String header = req.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(req, res);
            return;
        }

        String token = header.substring(7);
        try {
            Claims claims = jwtUtil.parse(token).getBody();
            Long userId = Long.valueOf(claims.getSubject());
            String role = (String) claims.get("role");

            var principal = new AuthUser(userId, role);
            List<GrantedAuthority> auths = List.of(new SimpleGrantedAuthority("ROLE_" + role));

            Authentication authentication =
                    new UsernamePasswordAuthenticationToken(principal, null, auths);

            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (Exception e) {
            // 토큰 이상하면 그냥 비인증 처리(401은 Security가 처리)
            SecurityContextHolder.clearContext();
        }

        chain.doFilter(req, res);
    }
}
