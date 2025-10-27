import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, input, Output } from "@angular/core";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ICategoria, IProducto } from "../../../interfaces";

@Component({
  selector: "app-producto-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./product-form.component.html",
  styleUrl: "./product-form.component.scss",
})
export class ProductoFormComponent {
  @Input() form!: FormGroup;
  @Input() categorias: ICategoria[] = [];
  @Input() showCategoriaSelector: boolean = true;
  @Output() callSaveMethod: EventEmitter<IProducto> =
    new EventEmitter<IProducto>();
}