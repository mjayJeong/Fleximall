package com.shopping.mall.product;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByNameContainingIgnoreCase(String query, Pageable pageable);

    @Query("""
        SELECT p
        FROM Product p
        LEFT JOIN Wishlist w ON w.product = p
        WHERE p.isActive = true
        GROUP BY p
        ORDER BY COUNT(w) DESC, p.createdAt DESC
    """)
    Page<Product> findAllActiveOrderByPopular(Pageable pageable);

    @Query("""
        SELECT p
        FROM Product p
        LEFT JOIN Wishlist w ON w.product = p
        WHERE p.isActive = true
          AND LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))
        GROUP BY p
        ORDER BY COUNT(w) DESC, p.createdAt DESC
    """)
    Page<Product> findActiveByNameOrderByPopular(@Param("query") String query, Pageable pageable);

    List<Product> findTop5ByOrderByStockAsc();

    Page<Product> findByIsActiveTrue(Pageable pageable);

    Page<Product> findByIsActiveTrueAndNameContainingIgnoreCase(String query, Pageable pageable);
}
