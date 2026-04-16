package com.rainbowforest.postservice.repository;

import com.rainbowforest.postservice.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<Post> findBySlugAndStatus(String slug, Integer status);
    List<Post> findAllByStatusOrderByCreatedAtDesc(Integer status);
}
