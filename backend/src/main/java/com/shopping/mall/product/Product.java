package com.shopping.mall.product;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Product {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private int price;

    private int stock;

    @Enumerated(EnumType.STRING)
    private ProductStatus status;

    private String thumbnailUrl;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    public void changeStock(int stock) {
        this.stock = stock;
        this.status = (stock <= 0) ? ProductStatus.SOLD_OUT : ProductStatus.ON_SALE;
    }

}
