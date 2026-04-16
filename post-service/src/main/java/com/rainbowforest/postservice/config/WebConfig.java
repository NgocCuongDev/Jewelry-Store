package com.rainbowforest.postservice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String workDir = System.getProperty("user.dir");
        String uploadPath = "file:" + workDir + "/src/main/resources/static/images/";
        
        registry.addResourceHandler("/images/**")
                .addResourceLocations(uploadPath);
    }
}
