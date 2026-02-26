package com.shopping.mall.cart;

import com.shopping.mall.product.Product;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table( uniqueConstraints =  {@UniqueConstraint(columnNames = {"userId", "product_id"})} )
public class CartItem {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private int quantity;

    public void changeQuantity(int quantity) {
        this.quantity = quantity;
    }

    public void increase(int delta) {
        this.quantity += delta;
    }
}
