package com.rainbowforest.paymentservice.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class VNPayCallbackDTO {
    private String orderId;
    private String transactionNo;
    private BigDecimal amount;
    private String status;
    private String bankCode;
    private String paymentTime;
}
