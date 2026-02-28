package com.shopping.mall.order;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(long userId);

    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :start AND o.createdAt < :end")
    long countOrdersBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o WHERE o.createdAt >= :start AND o.createdAt < :end")
    long sumRevenueBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
