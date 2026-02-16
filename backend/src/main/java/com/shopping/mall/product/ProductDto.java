package com.shopping.mall.product;

public record ProductDto (
    Long id,
    String name,
    int price,
    int stock,
    String status,
    String thumbnailUrl
) {
    public static ProductDto from(Product p) {
        return new ProductDto(
                p.getId(),
                p.getName(),
                p.getPrice(),
                p.getStock(),
                p.getStatus().name(),
                p.getThumbnailUrl()
        );
    }
}