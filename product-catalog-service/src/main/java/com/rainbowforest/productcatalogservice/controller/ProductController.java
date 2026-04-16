package com.rainbowforest.productcatalogservice.controller;

import com.rainbowforest.productcatalogservice.entity.Product;
import com.rainbowforest.productcatalogservice.http.header.HeaderGenerator;
import com.rainbowforest.productcatalogservice.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import jakarta.servlet.http.HttpServletRequest;

@RestController
public class ProductController {

    @Autowired
    private ProductService productService;
    
    @Autowired
    private HeaderGenerator headerGenerator;

    @GetMapping (value = "/products")
    public ResponseEntity<List<Product>> getAllProducts(){
        List<Product> products =  productService.getAllProduct();
        // Trả về 200 OK ngay cả khi không có sản phẩm nào để Frontend không bị lỗi 404
        return new ResponseEntity<List<Product>>(
                products,
                headerGenerator.getHeadersForSuccessGetMethod(),
                HttpStatus.OK);
    }

    @GetMapping(value = "/products", params = "categoryId")
    public ResponseEntity<List<Product>> getAllProductByCategory(@RequestParam ("categoryId") Long categoryId){
        List<Product> products = productService.getAllProductByCategory(categoryId);
        // Trả về 200 OK kèm mảng rỗng thay vì 404 để Frontend không bị lỗi
        return new ResponseEntity<List<Product>>(
                products,
                headerGenerator.getHeadersForSuccessGetMethod(),
                HttpStatus.OK);
    }

    @GetMapping (value = "/products/{id}")
    public ResponseEntity<Product> getOneProductById(@PathVariable ("id") long id){
        Product product =  productService.getProductById(id);
        if(product != null) {
        	return new ResponseEntity<Product>(
        			product,
        			headerGenerator.getHeadersForSuccessGetMethod(),
        			HttpStatus.OK);
        }
        return new ResponseEntity<Product>(
        		headerGenerator.getHeadersForError(),
        		HttpStatus.NOT_FOUND);
    }

    @GetMapping (value = "/products/search")
    public ResponseEntity<List<Product>> getAllProductsByName(@RequestParam ("name") String name){
        List<Product> products =  productService.getAllProductsByName(name);
        // Trả về 200 OK ngay cả khi không tìm thấy để Frontend xử lý mảng rỗng
        return new ResponseEntity<List<Product>>(
                products,
                headerGenerator.getHeadersForSuccessGetMethod(),
                HttpStatus.OK);
    }
    @PostMapping (value = "/products")
    @ResponseStatus (HttpStatus.CREATED)
    public ResponseEntity<Product> addProduct(@RequestBody Product product, HttpServletRequest request) {
        Product newProduct = productService.addProduct(product);
        return new ResponseEntity<Product>(
                newProduct,
                headerGenerator.getHeadersForSuccessPostMethod(request, newProduct.getId()),
                HttpStatus.CREATED);
    }

    @PutMapping (value = "/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable ("id") long id, @RequestBody Product product){
        Product updatedProduct = productService.updateProduct(id, product);
        if(updatedProduct != null) {
            return new ResponseEntity<Product>(
                    updatedProduct,
                    headerGenerator.getHeadersForSuccessGetMethod(),
                    HttpStatus.OK);
        }
        return new ResponseEntity<Product>(
                headerGenerator.getHeadersForError(),
                HttpStatus.NOT_FOUND);
    }

    @DeleteMapping (value = "/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable ("id") long id){
        Product product = productService.getProductById(id);
        if(product != null) {
            productService.deleteProduct(id);
            return new ResponseEntity<Void>(
                    headerGenerator.getHeadersForSuccessGetMethod(),
                    HttpStatus.OK);
        }
        return new ResponseEntity<Void>(
                headerGenerator.getHeadersForError(),
                HttpStatus.NOT_FOUND);
    }
}
