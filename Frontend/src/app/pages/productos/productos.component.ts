import { CommonModule } from "@angular/common";
import { Component, effect, inject } from "@angular/core";
import { LoaderComponent } from "../../components/loader/loader.component";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { ProductoService } from "../../services/producto.service";
import { CategoriaService } from "../../services/categoria.service";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute } from "@angular/router";
import { IProducto } from "../../interfaces";
import { ProductoFormComponent } from "../../components/products/product-form/product-form.component";
import { ProductListComponent } from "../../components/products/product-list/product-list.component";

@Component({
  selector: "app-producto",
  standalone: true,
  imports: [
    CommonModule,
    LoaderComponent,
    ProductoFormComponent,
    ProductListComponent, 
    PaginationComponent,
  ],
  templateUrl: "./productos.component.html",
  styleUrls: ["./productos.component.scss"], 
})
export class ProductoComponent {
  public productoService: ProductoService = inject(ProductoService);
  public categoriaService: CategoriaService = inject(CategoriaService);
  public fb: FormBuilder = inject(FormBuilder);
  public authService: AuthService = inject(AuthService);
  public route: ActivatedRoute = inject(ActivatedRoute);

  public areActionsAvailable: boolean = false;

  public form = this.fb.group({
    id: [0],
    nombre: ["", Validators.required],
    descripcion: [""],
    precio: [0, Validators.required],
    cantidad: [0],
    categoriaId: ["", Validators.required],
  });

  constructor() {
    effect(() => {
      console.log("productos actualizados", this.productoService.productos$());
    });
  }

  ngOnInit() {
    this.categoriaService.getAll();
    this.productoService.getAll();
    this.route.data.subscribe((data) => {
      this.areActionsAvailable = this.authService.areActionsAvailable(
        data["authorities"] ? data["authorities"] : []
      );
      console.log("areActionsAvailable", this.areActionsAvailable);
    });
  }

  save(item: IProducto) {
    const categoriaId = this.form.get("categoriaId")?.value;

    if (item.id) {
      item.categoria = { id: Number(categoriaId) };
      this.productoService.update(item);
    } else {
      if (categoriaId) {
        this.productoService.addProductoToCategoria(Number(categoriaId), item);
      }
    }
    this.form.reset();
  }

  edit(item: IProducto) {
    this.form.patchValue({
      id: item.id || 0,
      nombre: item.nombre || "",
      descripcion: item.descripcion || "",
      precio: item.precio || 0,
      cantidad: item.cantidad || 0,
      categoriaId: item.categoria?.id?.toString() || "",
    });
  }

  delete(item: IProducto) {
    if (item.id && item.categoria?.id) {
      this.productoService.deleteProductoFromCategoria(
        item.categoria.id,
        item.id
      );
    } else if (item.id) {
      this.productoService.delete(item);
    }
  }
}
