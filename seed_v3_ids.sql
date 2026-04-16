-- Seed data v3: Đồng bộ Danh mục và Sản phẩm theo ID
USE product_catalog;

-- Xóa dữ liệu cũ để tránh xung đột
DELETE FROM products;
DELETE FROM categories;

-- 1. Nạp Danh mục với ID cố định
INSERT INTO categories (id, category_name) VALUES 
(1, 'Điện thoại'),
(2, 'Máy tính'),
(3, 'Phụ kiện'),
(4, 'Electronics'),
(5, 'Fashion'),
(6, 'Home & Garden');

-- 2. Nạp Sản phẩm với category_id tham chiếu đến ID trên
INSERT INTO products (id, product_name, price, discount_price, description, category_id, availability, image_url, active, created_at, updated_at)
VALUES 
(1, 'Laptop Gaming Xin Xo', 30000000, 25000000, 'Cau hinh cuc manh, Java 21 chay vu vu', 2, 10, 'images/41ed9c9c-eff0-4689-aad3-dc6557cb78cf.jpg', 1, NOW(), NOW()),

(2, 'Đồng hồ Luxury 2026', 1500000, 13000000, 'Độ nhạy cực cao, pin dùng 100 giờ', 5, 50, 'images/a5faeb13-d446-41ff-b4ed-fa7fa4f11bb3.png', 1, NOW(), NOW()),

(4, 'Iphone 20 Promax', 32000000, 30000000, 'Iphone 20 promax', 1, 45, 'images/656f25e2-a48f-4de8-8040-0b36e599ffcd.avif', 1, NOW(), NOW()),

(5, 'Iphone 21 Promax', 24000000, 20000000, 'iphone 21 Promax', 1, 34, 'images/e227bf18-9f87-439c-929a-8c958b8562c2.png', 1, NOW(), NOW()),

(6, 'Royal Emerald Cat Castle', 2500000, 2200000, 'A luxurious emerald-themed castle for your feline royalty.', 6, 5, 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&q=80&w=800', 1, NOW(), NOW()),

(7, 'Golden Paw Diamond Collar', 1200000, 0, 'Handcrafted with golden accents and premium crystals.', 3, 10, 'https://images.unsplash.com/photo-1591130901021-026850c99fc5?auto=format&fit=crop&q=80&w=800', 1, NOW(), NOW()),

(8, 'Midnight Velvet Pet Bed', 850000, 650000, 'Ultra-soft midnight velvet for the ultimate sleep experience.', 6, 15, 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800', 1, NOW(), NOW());
