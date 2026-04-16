package com.rainbowforest.userservice.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

@Configuration
public class DatabaseConfig {

    @Bean
    public CommandLineRunner updateSchema(DataSource dataSource) {
        return args -> {
            try (Connection connection = dataSource.getConnection();
                 Statement statement = connection.createStatement()) {
                System.out.println("Executing manual schema update: ALTER TABLE users MODIFY user_password VARCHAR(255)");
                statement.execute("ALTER TABLE users MODIFY user_password VARCHAR(255)");
                System.out.println("Manual schema update successful.");
            } catch (Exception e) {
                System.err.println("Manual schema update failed: " + e.getMessage());
            }
        };
    }
}
