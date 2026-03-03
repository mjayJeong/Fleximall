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

    @Column(nullable = false)
    private boolean isActive;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (!isActive) isActive = true;
    }

    public void changeStock(int stock) {
        this.stock = stock;
        this.status = (stock <= 0) ? ProductStatus.SOLD_OUT : ProductStatus.ON_SALE;
    }

    public void changeThumbnailUrl(String url) {
        this.thumbnailUrl = url;
    }

    public void updateBasic(String name, int price, int stock) {
        this.name = name;
        this.price = price;
        changeStock(stock);
    }

    public void deactivate() {
        this.isActive = false;
    }
    public void activate() {
        this.isActive = true;
    }
}
