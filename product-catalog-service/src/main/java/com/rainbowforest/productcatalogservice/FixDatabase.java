
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class FixDatabase {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/product_catalog?useSSL=false";
        String user = "root";
        String password = "";

        try (Connection conn = DriverManager.getConnection(url, user, password);
             Statement stmt = conn.createStatement()) {
            
            System.out.println("Checking columns in 'products' table...");
            // We can just try to drop it, if it fails it's fine
            try {
                stmt.executeUpdate("ALTER TABLE products DROP COLUMN category");
                System.out.println("Successfully dropped 'category' column.");
            } catch (Exception e) {
                System.out.println("Failed to drop 'category' column (it might not exist or other error): " + e.getMessage());
            }

            try {
                stmt.executeUpdate("CREATE TABLE IF NOT EXISTS categories (id BIGINT AUTO_INCREMENT PRIMARY KEY, category_name VARCHAR(255) NOT NULL UNIQUE)");
                System.out.println("Ensured 'categories' table exists.");
                
                // Seed some categories
                stmt.executeUpdate("INSERT IGNORE INTO categories (id, category_name) VALUES (1, 'Thức ăn'), (2, 'Đồ chơi'), (3, 'Phụ kiện'), (4, 'Vệ sinh'), (5, 'Thời trang')");
                System.out.println("Seeded categories.");
            } catch (Exception e) {
                System.out.println("Error ensuring categories: " + e.getMessage());
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
