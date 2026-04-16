-- Dữ liệu mẫu bài viết (Blog) về Trang sức cho post_db
USE post_db;

-- Xóa dữ liệu cũ nếu muốn làm mới hoàn toàn
-- DELETE FROM posts;

INSERT INTO posts (title, slug, content, thumbnail, status, created_at) VALUES 
('Bí quyết chọn Nhẫn Kim Cương hoàn hảo', 'bi-quyet-chon-nhan-kim-cuong', 'Khi chọn nhẫn kim cương, bạn cần lưu ý quy tắc 4C: Carat (Trọng lượng), Color (Màu sắc), Clarity (Độ tinh khiết) và Cut (Vết cắt)...', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800', 1, NOW()),

('Xu hướng Trang sức cưới năm 2026', 'xu-huong-trang-suc-cuoi-2026', 'Năm 2026 chứng kiến sự lên ngôi của các thiết kế tối giản nhưng sang trọng, sử dụng chất liệu vàng hồng và đá quý tự nhiên...', 'https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?q=80&w=800', 1, NOW()),

('Cách bảo quản trang sức Bạc luôn sáng bóng', 'cach-bao-quan-trang-suc-bac', 'Trang sức bạc rất dễ bị xỉn màu do tác động của không khí. Để giữ bạc luôn sáng, hãy sử dụng khăn lau chuyên dụng hoặc hỗn hợp chanh muối...', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800', 1, NOW()),

('Ý nghĩa của các loại đá quý theo tháng sinh', 'y-nghia-da-quy-theo-thang-sinh', 'Mỗi tháng sinh đều gắn liền với một loại đá quý hộ mệnh mang lại may mắn và tài lộc. Ví dụ tháng 1 là đá Garnet, tháng 4 là Kim cương...', 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=800', 1, NOW()),

('Bộ sưu tập trang sức Ngọc Trai quý phái', 'bo-suu-tap-trang-suc-ngoc-trai', 'Ngọc trai được mệnh danh là nữ hoàng của các loại đá quý. Bộ sưu tập mới của chúng tôi mang lại vẻ đẹp thanh lịch và vượt thời gian...', 'https://images.unsplash.com/photo-1596944210900-346707d2ef65?q=80&w=800', 1, NOW());
