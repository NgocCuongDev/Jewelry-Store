package com.rainbowforest.userservice.dto;

public class LoginResponse {
    private String token;
    private Long userId;
    private String userName;
    private String userImage;

    public LoginResponse(String token, Long userId, String userName, String userImage) {
        this.token = token;
        this.userId = userId;
        this.userName = userName;
        this.userImage = userImage;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getUserImage() { return userImage; }
    public void setUserImage(String userImage) { this.userImage = userImage; }
}
