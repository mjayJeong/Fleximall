package com.shopping.mall.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByNameContainingIgnoreCase(String query, Pageable pageable);

    @Query("""
            SELECT p
            FROM Product p
            LEFT JOIN Wishlist w on w.product = p
            GROUP BY p
            ORDER BY COUNT(w) DESC, p.createdAt DESC
            """)
    Page<Product> findAllOrderByPopular(Pageable pageable);

    @Query("""
            SELECT p
            FROM Product p
            LEFT JOIN Wishlist w on w.product = p
            WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))
            GROUP BY p
            ORDER BY COUNT(w) DESC, p.createdAt DESC
            """)
    Page<Product> findByNameOrderByPopular(@Param("query") String query, Pageable pageable);
}
