package com.shopping.mall.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.Map;

@Component
public class JwtUtil {

    private final Key key = Keys.hmacShaKeyFor(
            "CHANGE_THIS_TO_A_LONG_SECRET_KEY_32BYTES_MINIMUM!!".getBytes()
    );

    private final long accessTokenMs = 1000L * 60 * 60 * 3;     // 3시간

    public String createToken(Long userId, String role) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + accessTokenMs);

        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .setIssuedAt(now)
                .setExpiration(exp)
                .addClaims(Map.of("role", role))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Jws<Claims> parse(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
    }
}
