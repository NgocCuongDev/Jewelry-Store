package com.rainbowforest.productcatalogservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import com.rainbowforest.productcatalogservice.entity.Category;
import com.rainbowforest.productcatalogservice.repository.CategoryRepository;

@SpringBootApplication
@EnableJpaRepositories
public class ProductCatalogServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ProductCatalogServiceApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedCategories(CategoryRepository categoryRepository) {
        return args -> {
            if (categoryRepository.count() == 0) {
                categoryRepository.save(new Category("Thức ăn"));
                categoryRepository.save(new Category("Đồ chơi"));
                categoryRepository.save(new Category("Phụ kiện"));
                categoryRepository.save(new Category("Vệ sinh"));
                categoryRepository.save(new Category("Thời trang"));
                System.out.println("✅ Categories seeded successfully!");
            }
        };
    }
}
