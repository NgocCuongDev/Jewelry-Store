-- Seed data cho database product_catalog
USE product_catalog;

-- Xóa dữ liệu cũ nếu muốn làm sạch
-- DELETE FROM products;

INSERT INTO products (product_name, price, discount_price, description, category, availability, image_url, active, created_at, updated_at)
VALUES 
('Thức ăn hạt cho chó Royal Canin Adult', 550000, 495000, 'Thức ăn dinh dưỡng cao cấp cho chó trưởng thành, giúp lông mượt và hệ tiêu hóa khỏe mạnh.', 'Thức ăn', 50, 'https://images.unsplash.com/photo-1589924691106-07a2c855d506?q=80&w=500', 1, NOW(), NOW()),

('Pate cho mèo Whiskas vị cá ngừ', 150000, 135000, 'Pate thơm ngon bổ sung taurine và vitamin cho mèo mọi lứa tuổi.', 'Thức ăn', 100, 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=500', 1, NOW(), NOW()),

('Chuồng chó Inox cao cấp size L', 1200000, 1100000, 'Chuồng inox 304 không gỉ, chắc chắn và rộng rãi cho chó lớn.', 'Phụ kiện', 10, 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=500', 1, NOW(), NOW()),

('Đồ chơi xương gặm cao su cho chó', 85000, 0, 'Xương gặm giúp làm sạch răng và giải tỏa căng thẳng cho thú cưng.', 'Đồ chơi', 200, 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=500', 1, NOW(), NOW()),

('Trụ cào móng cho mèo 3 tầng', 450000, 399000, 'Thiết kế sang trọng, tích hợp đồ chơi treo giúp mèo vận động.', 'Phụ kiện', 15, 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=500', 1, NOW(), NOW()),

('Sữa tắm thú cưng Joyce & Dolls', 220000, 195000, 'Hương nước hoa pháp sang trọng, khử mùi hôi và làm mềm lông.', 'Vệ sinh', 40, 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=500', 1, NOW(), NOW()),

('Bát ăn đôi cho chó mèo bằng sứ', 120000, 0, 'Bát sứ cao cấp, đế gỗ chống trượt, dễ dàng vệ sinh.', 'Phụ kiện', 30, 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=500', 1, NOW(), NOW()),

('Áo len thời trang cho chó mèo size M', 95000, 0, 'Chất liệu len mềm mại, giữ ấm tốt cho thú cưng vào mùa đông.', 'Thời trang', 60, 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=500', 1, NOW(), NOW());
