import { CommonModule } from "@angular/common";
import { Component, effect, inject } from "@angular/core";
import { LoaderComponent } from "../../components/loader/loader.component";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { CategoriaService } from "../../services/categoria.service";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute } from "@angular/router";
import { ICategoria } from "../../interfaces";
import { CategoriaFormComponent } from "../../components/categoria-form/categoria-form.component";
import { CategoriaListaComponent } from "../../components/categoria-lista/categoria-lista.component";

@Component({
  selector: "app-categoria",
  standalone: true,
  imports: [
    CommonModule,
    CategoriaFormComponent,
    CategoriaListaComponent,
    LoaderComponent,
    PaginationComponent,
  ],
  templateUrl: "./categorias.component.html",
  styleUrl: "./categorias.component.scss",
})
export class CategoriaComponent {
  public categoriaService: CategoriaService = inject(CategoriaService);
  public fb: FormBuilder = inject(FormBuilder);
  public areActionsAvailable: boolean = false;
  public authService: AuthService = inject(AuthService);
  public route: ActivatedRoute = inject(ActivatedRoute);

  public isEdit: boolean = false;

  public form = this.fb.group({
    id: [0],
    nombre: ["", Validators.required],
    descripcion: [""],
  });

  constructor() {
    effect(() => {
      console.log("Categoria updated", this.categoriaService.categorias$());
    });
  }

  ngOnInit() {
    this.categoriaService.getAll();
    this.route.data.subscribe((data) => {
      this.areActionsAvailable = this.authService.areActionsAvailable(
        data["authorities"] ? data["authorities"] : []
      );
      console.log("areActionsAvailable", this.areActionsAvailable);
    });
  }

  save(categoria: ICategoria) {
    categoria.id
      ? this.categoriaService.update(categoria)
      : this.categoriaService.save(categoria);
    this.form.reset();
  }

  delete(categoria: ICategoria) {
    console.log("delete", categoria);
    this.categoriaService.delete(categoria);
  }
}