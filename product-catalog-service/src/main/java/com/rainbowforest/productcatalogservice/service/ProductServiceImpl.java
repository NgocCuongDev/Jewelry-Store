package com.rainbowforest.productcatalogservice.service;

import com.rainbowforest.productcatalogservice.entity.Product;
import com.rainbowforest.productcatalogservice.entity.Category;
import com.rainbowforest.productcatalogservice.repository.ProductRepository;
import com.rainbowforest.productcatalogservice.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    private static final String UPLOAD_DIR = "src/main/resources/static/";

    @Override
    public List<Product> getAllProduct() {
        return productRepository.findAll();
    }

    @Override
    public List<Product> getAllProductByCategory(Long categoryId) {
        return productRepository.findAllByCategoryId(categoryId);
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @Override
    public List<Product> getAllProductsByName(String name) {
        String trimmedName = (name != null) ? name.trim() : "";
        return productRepository.findAllByProductNameContainingIgnoreCase(trimmedName);
    }

    @Override
    public Product addProduct(Product product) {
        System.out.println("📝 Attempting to add product: " + product.getProductName());
        System.out.println("   - Price: " + product.getPrice());
        System.out.println("   - Category ID: " + (product.getCategory() != null ? product.getCategory().getId() : "NULL"));
        System.out.println("   - Active: " + product.isActive());

        // Fetch managed category from DB to avoid transient/detached entity issues
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            Category managedCategory = categoryRepository.findById(product.getCategory().getId()).orElse(null);
            if (managedCategory != null) {
                System.out.println("   - Managed Category found: " + managedCategory.getCategoryName());
                product.setCategory(managedCategory);
            } else {
                System.out.println("   ⚠️ Warning: Category with ID " + product.getCategory().getId() + " not found!");
            }
        }

        try {
            Product saved = productRepository.save(product);
            System.out.println("✅ Product saved successfully with ID: " + saved.getId());
            return saved;
        } catch (Exception e) {
            System.err.println("❌ CRITICAL DATABASE ERROR while saving product:");
            System.err.println("   Message: " + e.getMessage());
            if (e.getCause() != null) {
                System.err.println("   Cause: " + e.getCause().getMessage());
            }
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public Product updateProduct(Long id, Product product) {
        Product existingProduct = productRepository.findById(id).orElse(null);
        if (existingProduct != null) {
            // Cleanup old image if it's being replaced
            if (existingProduct.getImageUrl() != null && product.getImageUrl() != null 
                && !existingProduct.getImageUrl().equals(product.getImageUrl())) {
                deleteImageFile(existingProduct.getImageUrl());
            }
            
            // Update fields manually to avoid session conflicts and maintain audit fields
            existingProduct.setProductName(product.getProductName());
            existingProduct.setPrice(product.getPrice());
            existingProduct.setDiscountPrice(product.getDiscountPrice());
            existingProduct.setDescription(product.getDescription());
            
            // Fetch managed category from DB to avoid transient/detached entity issues
            if (product.getCategory() != null && product.getCategory().getId() != null) {
                Category managedCategory = categoryRepository.findById(product.getCategory().getId()).orElse(null);
                existingProduct.setCategory(managedCategory);
            } else {
                existingProduct.setCategory(null);
            }
            
            existingProduct.setAvailability(product.getAvailability());
            existingProduct.setImageUrl(product.getImageUrl());
            existingProduct.setActive(product.isActive());
            
            // Hibernate will handle updatedAt via @PreUpdate
            try {
                return productRepository.save(existingProduct);
            } catch (Exception e) {
                System.err.println("Database Update Error: " + e.getMessage());
                e.printStackTrace();
                throw e;
            }
        }
        return null;
    }

    @Override
    public void deleteProduct(Long productId) {
        Product existingProduct = productRepository.findById(productId).orElse(null);
        if (existingProduct != null) {
            if (existingProduct.getImageUrl() != null) {
                deleteImageFile(existingProduct.getImageUrl());
            }
            productRepository.deleteById(productId);
        }
    }

    private void deleteImageFile(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) return;
        try {
            java.nio.file.Path path = java.nio.file.Paths.get(UPLOAD_DIR + imageUrl);
            java.nio.file.Files.deleteIfExists(path);
            System.out.println("Deleted old image file: " + path.toAbsolutePath());
        } catch (java.io.IOException e) {
            System.err.println("Failed to delete image file: " + e.getMessage());
        }
    }
}
