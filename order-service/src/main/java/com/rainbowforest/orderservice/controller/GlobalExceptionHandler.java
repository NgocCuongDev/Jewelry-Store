package com.rainbowforest.orderservice.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import jakarta.servlet.http.HttpServletRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleAllExceptions(Exception ex, HttpServletRequest request) {
        logger.error("FATAL ERROR IN REQUEST {}: {}", request.getRequestURI(), ex.getMessage(), ex);
        return new ResponseEntity<>("CUSTOM 500: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
