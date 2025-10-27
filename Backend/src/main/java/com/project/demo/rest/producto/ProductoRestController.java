package com.project.demo.rest.producto;

import com.project.demo.logic.entity.categoria.Categoria;
import com.project.demo.logic.entity.categoria.CategoriaRepository;
import com.project.demo.logic.entity.producto.Producto;
import com.project.demo.logic.entity.producto.ProductoRepository;
import com.project.demo.logic.entity.http.GlobalResponseHandler;
import com.project.demo.logic.entity.http.Meta;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/productos")
public class ProductoRestController {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {

        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Producto> productosPage = productoRepository.findAll(pageable);

        Meta meta = new Meta(request.getMethod(), request.getRequestURL().toString());
        meta.setTotalPages(productosPage.getTotalPages());
        meta.setTotalElements(productosPage.getTotalElements());
        meta.setPageNumber(productosPage.getNumber() + 1);
        meta.setPageSize(productosPage.getSize());

        return new GlobalResponseHandler().handleResponse(
                "Productos retrieved successfully",
                productosPage.getContent(),
                HttpStatus.OK,
                meta
        );
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN_ROLE')")
    public ResponseEntity<?> createProducto(@RequestBody Producto producto, HttpServletRequest request) {
        if (producto.getCategoria() != null && producto.getCategoria().getId() != null) {
            Categoria categoria = categoriaRepository.findById(producto.getCategoria().getId())
                    .orElseThrow(() -> new RuntimeException("Categoria no encontrada"));
            producto.setCategoria(categoria);
        }
        Producto savedProducto = productoRepository.save(producto);
        return new GlobalResponseHandler().handleResponse(
                "Producto created successfully",
                savedProducto,
                HttpStatus.CREATED,
                request
        );
    }

    @PutMapping("/{productoId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN_ROLE')")
    public ResponseEntity<?> updateProducto(
            @PathVariable Long productoId,
            @RequestBody Producto producto,
            HttpServletRequest request) {

        Optional<Producto> foundProducto = productoRepository.findById(productoId);

        if (foundProducto.isPresent()) {
            Producto existingProducto = foundProducto.get();

            if (producto.getCategoria() != null && producto.getCategoria().getId() != null) {
                Categoria categoria = categoriaRepository.findById(producto.getCategoria().getId())
                        .orElseThrow(() -> new RuntimeException("Categoria no encontrada"));
                existingProducto.setCategoria(categoria);
            }

            existingProducto.setNombre(producto.getNombre());
            existingProducto.setDescripcion(producto.getDescripcion());
            existingProducto.setPrecio(producto.getPrecio());
            existingProducto.setCantidad(producto.getCantidad());


            productoRepository.save(existingProducto);

            return new GlobalResponseHandler().handleResponse(
                    "Producto updated successfully",
                    existingProducto,
                    HttpStatus.OK,
                    request
            );
        } else {
            return new GlobalResponseHandler().handleResponse(
                    "Producto id " + productoId + " not found",
                    HttpStatus.NOT_FOUND,
                    request
            );
        }
    }

    @PatchMapping("/{productoId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN_ROLE')")
    public ResponseEntity<?> patchProducto(
            @PathVariable Long productoId,
            @RequestBody Producto producto,
            HttpServletRequest request) {

        Optional<Producto> foundProducto = productoRepository.findById(productoId);

        if (foundProducto.isPresent()) {
            Producto existingProducto = foundProducto.get();

            if (producto.getNombre() != null) existingProducto.setNombre(producto.getNombre());
            if (producto.getDescripcion() != null) existingProducto.setDescripcion(producto.getDescripcion());
            if (producto.getPrecio() != null) existingProducto.setPrecio(producto.getPrecio());
            if (producto.getCantidad() != null) existingProducto.setCantidad(producto.getCantidad());
            if (producto.getCategoria() != null) existingProducto.setCategoria(producto.getCategoria());

            productoRepository.save(existingProducto);

            return new GlobalResponseHandler().handleResponse(
                    "Producto updated successfully",
                    existingProducto,
                    HttpStatus.OK,
                    request
            );
        } else {
            return new GlobalResponseHandler().handleResponse(
                    "Producto id " + productoId + " not found",
                    HttpStatus.NOT_FOUND,
                    request
            );
        }
    }

    @DeleteMapping("/{productoId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN_ROLE')")
    public ResponseEntity<?> deleteProducto(
            @PathVariable Long productoId,
            HttpServletRequest request) {

        Optional<Producto> foundProducto = productoRepository.findById(productoId);

        if (foundProducto.isPresent()) {
            Optional<Categoria> categoria = categoriaRepository.findById(foundProducto.get().getCategoria().getId());
            categoria.get().getProductos().remove(foundProducto.get());
            productoRepository.deleteById(foundProducto.get().getId());
            return new GlobalResponseHandler().handleResponse(
                    "Producto deleted successfully",
                    foundProducto.get(),
                    HttpStatus.OK,
                    request
            );
        } else {
            return new GlobalResponseHandler().handleResponse(
                    "Producto id " + productoId + " not found",
                    HttpStatus.NOT_FOUND,
                    request
            );
        }
    }
}
