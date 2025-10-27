package com.project.demo.rest.categoria;

import com.project.demo.logic.entity.categoria.Categoria;
import com.project.demo.logic.entity.categoria.CategoriaRepository;
import com.project.demo.logic.entity.http.GlobalResponseHandler;
import com.project.demo.logic.entity.http.Meta;
import com.project.demo.logic.entity.producto.Producto;
import com.project.demo.logic.entity.producto.ProductoRepository;
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
@RequestMapping("/categorias")
@CrossOrigin(origins = "*")
public class CategoriaRestController {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    // ===============================
    // 🔹 Obtener todas las categorías
    // ===============================
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getAll(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {

        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Categoria> categoriasPage = categoriaRepository.findAll(pageable);
        Meta meta = new Meta(request.getMethod(), request.getRequestURL().toString());
        meta.setTotalPages(categoriasPage.getTotalPages());
        meta.setTotalElements(categoriasPage.getTotalElements());
        meta.setPageNumber(categoriasPage.getNumber() + 1);
        meta.setPageSize(categoriasPage.getSize());

        return new GlobalResponseHandler().handleResponse(
                "Categoria retrieved successfully",
                categoriasPage.getContent(),
                HttpStatus.OK,
                meta
        );
    }

    // ===============================
    // 🔹 Crear categoría
    // ===============================
    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN_ROLE')")
    public ResponseEntity<?> createCategoria(@RequestBody Categoria categoria, HttpServletRequest request) {
        Categoria savedCategoria = categoriaRepository.save(categoria);
        return new GlobalResponseHandler().handleResponse(
                "Categoria created successfully",
                savedCategoria,
                HttpStatus.CREATED,
                request
        );
    }

    // ===============================
    // 🔹 Actualizar categoría (PUT)
    // ===============================
    @PutMapping("/{categoriaId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN_ROLE')")
    public ResponseEntity<?> updateCategoria(@PathVariable Long categoriaId, @RequestBody Categoria categoria, HttpServletRequest request) {
        Optional<Categoria> foundCategoria = categoriaRepository.findById(categoriaId);

        if (foundCategoria.isPresent()) {
            foundCategoria.get().setNombre(categoria.getNombre());
            foundCategoria.get().setDescripcion(categoria.getDescripcion());
            categoriaRepository.save(foundCategoria.get());
            return new GlobalResponseHandler().handleResponse(
                    "Categoria updated successfully",
                    foundCategoria,
                    HttpStatus.OK,
                    request
            );
        } else {
            return new GlobalResponseHandler().handleResponse(
                    "Categoria id " + categoriaId + " not found",
                    HttpStatus.NOT_FOUND,
                    request
            );
        }
    }

    // ===============================
    // 🔹 Actualizar parcialmente (PATCH)
    // ===============================
    @PatchMapping("/{categoriaId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN_ROLE')")
    public ResponseEntity<?> patchCategoria(@PathVariable Long categoriaId, @RequestBody Categoria categoria, HttpServletRequest request) {
        Optional<Categoria> foundCategoria = categoriaRepository.findById(categoriaId);
        if (foundCategoria.isPresent()) {
            if (categoria.getNombre() != null)
                foundCategoria.get().setNombre(categoria.getNombre());
            if (categoria.getDescripcion() != null)
                foundCategoria.get().setDescripcion(categoria.getDescripcion());
            categoriaRepository.save(foundCategoria.get());
            return new GlobalResponseHandler().handleResponse(
                    "Categoria updated successfully",
                    foundCategoria.get(),
                    HttpStatus.OK,
                    request
            );
        } else {
            return new GlobalResponseHandler().handleResponse(
                    "Categoria id " + categoriaId + " not found",
                    HttpStatus.NOT_FOUND,
                    request
            );
        }
    }

    // ===============================
    // 🔹 Eliminar categoría
    // ===============================
    @DeleteMapping("/{categoriaId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN_ROLE')")
    public ResponseEntity<?> deleteCategoria(@PathVariable Long categoriaId, HttpServletRequest request) {
        Optional<Categoria> foundCategoria = categoriaRepository.findById(categoriaId);
        if (foundCategoria.isPresent()) {
            categoriaRepository.delete(foundCategoria.get());
            return new GlobalResponseHandler().handleResponse(
                    "Categoria deleted successfully",
                    foundCategoria.get(),
                    HttpStatus.OK,
                    request
            );
        } else {
            return new GlobalResponseHandler().handleResponse(
                    "Categoria id " + categoriaId + " not found",
                    HttpStatus.NOT_FOUND,
                    request
            );
        }
    }

    // ===============================
    // 🔹 Agregar producto a una categoría
    // ===============================
    @PostMapping("/{categoriaId}/productos")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN_ROLE')")
    public ResponseEntity<?> addProductoToCategoria(
            @PathVariable Long categoriaId,
            @RequestBody Producto producto,
            HttpServletRequest request) {

        Optional<Categoria> foundCategoria = categoriaRepository.findById(categoriaId);

        if (foundCategoria.isEmpty()) {
            return new GlobalResponseHandler().handleResponse(
                    "Categoria id " + categoriaId + " not found",
                    HttpStatus.NOT_FOUND,
                    request
            );
        }

        producto.setCategoria(foundCategoria.get());
        Producto savedProducto = productoRepository.save(producto);

        return new GlobalResponseHandler().handleResponse(
                "Producto agregado correctamente a la categoria " + categoriaId,
                savedProducto,
                HttpStatus.CREATED,
                request
        );
    }
}
