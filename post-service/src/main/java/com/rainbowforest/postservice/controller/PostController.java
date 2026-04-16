package com.rainbowforest.postservice.controller;

import com.rainbowforest.postservice.entity.Post;
import com.rainbowforest.postservice.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @GetMapping("/all-posts")
    public List<Post> getAllPosts() {
        return postRepository.findAllByStatusOrderByCreatedAtDesc(1);
    }

    @GetMapping("/posts")
    public List<Post> getPostsWithStatus() {
        return postRepository.findAllByStatusOrderByCreatedAtDesc(1);
    }

    @GetMapping("/post/slug/{slug}")
    public ResponseEntity<Post> getPostBySlug(@PathVariable String slug) {
        return postRepository.findBySlugAndStatus(slug, 1)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/post/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        return postRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/post")
    public Post createPost(@RequestBody Post post) {
        return postRepository.save(post);
    }
}
