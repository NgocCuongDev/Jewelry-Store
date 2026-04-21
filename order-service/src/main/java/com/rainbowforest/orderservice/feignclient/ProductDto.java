package com.rainbowforest.orderservice.feignclient;

import java.math.BigDecimal;
import java.util.Map;

public class ProductDto {
    private Long id;
    private String productName;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private String description;
    private Map<String, Object> category;
    private int availability;
    private String imageUrl;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public BigDecimal getDiscountPrice() { return discountPrice; }
    public void setDiscountPrice(BigDecimal discountPrice) { this.discountPrice = discountPrice; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Map<String, Object> getCategory() { return category; }
    public void setCategory(Map<String, Object> category) { this.category = category; }
    
    public int getAvailability() { return availability; }
    public void setAvailability(int availability) { this.availability = availability; }
    
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
