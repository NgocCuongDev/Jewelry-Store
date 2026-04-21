package com.rainbowforest.orderservice.feignclient;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShippingDto {
    private Long id;
    private Long orderId;
    private String trackingNumber;
    private String status;
    private String shippingAddress;
    private LocalDateTime shippingDate;
}
