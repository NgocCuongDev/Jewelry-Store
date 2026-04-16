package com.rainbowforest.bannerservice.controller;

import com.rainbowforest.bannerservice.entity.Banner;
import com.rainbowforest.bannerservice.repository.BannerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
public class BannerController {

    @Autowired
    private BannerRepository bannerRepository;

    @GetMapping("/banners-slideshow")
    public List<Banner> getSlideshowBanners() {
        return bannerRepository.findAllByStatusAndPosition(1, "slideshow");
    }

    @GetMapping("/banner/{id}")
    public ResponseEntity<Banner> getBannerById(@PathVariable Long id) {
        return bannerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/banner")
    public Banner createBanner(@RequestBody Banner banner) {
        return bannerRepository.save(banner);
    }
}
