package com.rainbowforest.userservice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String workDir = System.getProperty("user.dir");
        // Phục vụ ảnh từ thư mục src/main/resources/static/images/
        String uploadPath = "file:" + workDir + "/src/main/resources/static/images/";
        
        registry.addResourceHandler("/images/**")
                .addResourceLocations(uploadPath);
    }
}
