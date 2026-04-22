package com.rainbowforest.userservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendResetCode(String toEmail, String code) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setTo(toEmail);
        helper.setSubject("Mã xác nhận khôi phục mật khẩu - NNC PET SHOP");

        String htmlContent = "<div style=\"font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;\">" +
                "  <div style=\"text-align: center; margin-bottom: 30px;\">" +
                "    <h1 style=\"color: #007bff; margin: 0;\">NNC PET SHOP</h1>" +
                "    <p style=\"color: #6c757d; font-size: 14px;\">Hệ thống quản lý e-commerce cao cấp</p>" +
                "  </div>" +
                "  <div style=\"background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: center;\">" +
                "    <h2 style=\"color: #343a40; margin-top: 0;\">Khôi phục mật khẩu</h2>" +
                "    <p style=\"color: #495057; font-size: 16px; line-height: 1.6;\">Chào bạn, chúng tôi đã nhận được yêu cầu khôi phục mật khẩu của bạn. Vui lòng sử dụng mã xác nhận bên dưới để tiếp tục:</p>" +
                "    <div style=\"margin: 30px 0; padding: 15px; background-color: #f1f3f5; border-radius: 6px; font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #007bff; border: 2px dashed #adb5bd;\">" +
                "      " + code +
                "    </div>" +
                "    <p style=\"color: #868e96; font-size: 14px;\">Mã xác nhận này sẽ hết hạn sau <strong>10 phút</strong>.</p>" +
                "    <p style=\"color: #dc3545; font-size: 13px; font-style: italic;\">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này hoặc liên hệ hỗ trợ.</p>" +
                "  </div>" +
                "  <div style=\"text-align: center; margin-top: 30px; color: #adb5bd; font-size: 12px;\">" +
                "    &copy; 2026 NNC PET SHOP. All rights reserved." +
                "  </div>" +
                "</div>";

        helper.setText(htmlContent, true);
        mailSender.send(message);
    }
}
