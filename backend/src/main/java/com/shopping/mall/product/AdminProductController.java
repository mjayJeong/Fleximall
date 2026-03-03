package com.shopping.mall.product;

import com.shopping.mall.file.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/products")
public class AdminProductController {

    private final ProductRepository productRepository;
    private final FileStorageService fileStorageService;

    // 썸네일 업로드 : multipart/form-data
    @PostMapping("/{id}/thumbnail")
    public ProductDto uploadThumbnail(@PathVariable Long id,
                                      @RequestPart("file") MultipartFile file) {

        Product p = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("product not found"));

        String url = fileStorageService.saveImage(file);
        p.changeThumbnailUrl(url);
        Product saved = productRepository.save(p);

        return ProductDto.from(saved);
    }

    @PatchMapping("/{id}")
    public ProductDto updateProduct(@PathVariable Long id, @RequestBody UpdateProductRequest req) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("product not found"));

        p.updateBasic(req.name(), req.price(), req.stock());
        Product saved = productRepository.save(p);
        return ProductDto.from(saved);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("product not found"));
        p.deactivate();
        productRepository.save(p);
    }
}
