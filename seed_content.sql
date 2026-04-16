-- Nạp dữ liệu cho banner-service
USE banner_db;
-- DELETE FROM banners;
INSERT INTO banners (name, link, image, position, status) VALUES 
('Siêu SALE Phụ Kiện Pet', '/san-pham', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1200', 'slideshow', 1),
('Thức Ăn Dinh Dưỡng Cao Cấp', '/san-pham', 'https://images.unsplash.com/photo-1585481666746-83ca64971c6d?q=80&w=1200', 'slideshow', 1),
('Dịch Vụ Chăm Sóc Thú Cưng', '/dich-vu', 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=1200', 'slideshow', 1);

-- Nạp dữ liệu cho post-service
USE post_db;
-- DELETE FROM posts;
INSERT INTO posts (title, slug, content, thumbnail, status, created_at) VALUES 
('Cách chăm sóc mèo con mới về nhà', 'cach-cham-soc-meo-con', 'Chăm sóc mèo con đòi hỏi sự kiên nhẫn và kiến thức về dinh dưỡng...', 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800', 1, NOW()),
('Top 5 loại thức ăn tốt nhất cho chó Poodle', 'top-5-thuc-an-cho-poodle', 'Chó Poodle có hệ tiêu hóa khá nhạy cảm, bạn nên chọn các loại hạt...', 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800', 1, NOW()),
('Lợi ích của việc đưa thú cưng đi spa', 'loi-ich-dua-thu-cung-di-spa', 'Việc đi spa không chỉ giúp thú cưng sạch sẽ mà còn giúp giảm stress...', 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=800', 1, NOW());
