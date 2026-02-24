package com.shopping.mall.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI shoppingMallOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Shopping Mall API")
                        .description("Shopping mall backend API documentation")
                        .version("v1")
                        .contact(new Contact().name("Shopping Mall Team")));
    }
}
