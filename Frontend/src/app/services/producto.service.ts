import {
  ImportProvidersSource,
  inject,
  Injectable,
  signal,
} from "@angular/core";
import { BaseService } from "./base-service";
import { IProducto, IResponse, ISearch } from "../interfaces";
import { AlertService } from "./alert.service";

@Injectable({
  providedIn: "root",
})
export class ProductoService extends BaseService<IProducto> {
  protected override source: string = "productos";
  private productoSignal = signal<IProducto[]>([]);

  get productos$() {
    return this.productoSignal;
  }

  public search: ISearch = {
    page: 1,
    size: 10,
  };

  public totalItems: any = [];
  private alertService: AlertService = inject(AlertService);

  getAll() {
    this.findAllWithParams({
      page: this.search.page,
      size: this.search.size,
    }).subscribe({
      next: (response: IResponse<IProducto[]>) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from(
          { length: this.search.totalPages ? this.search.totalPages : 0 },
          (_, i) => i + 1
        );
        this.productoSignal.set(response.data);
      },
      error: (err: any) => {
        console.error("error", err);
      },
    });
  }

  getProductosByCategoriaId(categoriaId: number) {
    this.findAllWithParamsAndCustomSource(`categoria/${categoriaId}`, {
      page: this.search.page,
      size: this.search.size,
    }).subscribe({
      next: (response: IResponse<IProducto[]>) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from(
          { length: this.search.totalPages ? this.search.totalPages : 0 },
          (_, i) => i + 1
        );
        this.productoSignal.set(response.data);
      },
      error: (err: any) => {
        console.error("error", err);
      },
    });
  }

  addProductoToCategoria(categoriaId: number, producto: IProducto) {
    this.addCustomSource(
      `../categorias/${categoriaId}/productos`,
      producto
    ).subscribe({
      next: (response: IResponse<IProducto>) => {
        this.alertService.displayAlert(
          "success",
          response.message,
          "center",
          "top",
          ["success-snackbar"]
        );
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert(
          "error",
          "An error occurred adding the product",
          "center",
          "top",
          ["error-snackbar"]
        );
        console.error("error", err);
      },
    });
  }

  save(item: IProducto) {
    this.add(item).subscribe({
      next: (response: IResponse<IProducto>) => {
        this.alertService.displayAlert(
          "success",
          response.message,
          "center",
          "top",
          ["success-snackbar"]
        );
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert(
          "error",
          "An error occurred adding the product",
          "center",
          "top",
          ["error-snackbar"]
        );
        console.error("error", err);
      },
    });
  }

  update(item: IProducto) {
    this.edit(item.id, item).subscribe({
      next: (response: IResponse<IProducto>) => {
        this.alertService.displayAlert(
          "success",
          response.message,
          "center",
          "top",
          ["success-snackbar"]
        );
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert(
          "error",
          "An error occurred updating the product",
          "center",
          "top",
          ["error-snackbar"]
        );
        console.error("error", err);
      },
    });
  }

  delete(item: IProducto) {
    this.del(item.id).subscribe({
      next: (response: IResponse<IProducto>) => {
        this.alertService.displayAlert(
          "success",
          response.message,
          "center",
          "top",
          ["success-snackbar"]
        );
  
        this.productoSignal.update((productos) =>
          productos.filter((p) => p.id !== item.id)
        );
      },
      error: (err: any) => {
        this.alertService.displayAlert(
          "error",
          "An error occurred deleting the product",
          "center",
          "top",
          ["error-snackbar"]
        );
        console.error("error", err);
      },
    });
  }
  
  deleteProductoFromCategoria(categoriaId: number, productoId: number) {
    this.del(productoId).subscribe({
      next: (response: IResponse<IProducto>) => {
        this.alertService.displayAlert(
          "success",
          response.message,
          "center",
          "top",
          ["success-snackbar"]
        );
  
        this.productoSignal.update((productos) =>
          productos.filter((p) => p.id !== productoId)
        );
      },
      error: (err: any) => {
        this.alertService.displayAlert(
          "error",
          "An error occurred deleting the product",
          "center",
          "top",
          ["error-snackbar"]
        );
        console.error("error", err);
      },
    });
  }
}