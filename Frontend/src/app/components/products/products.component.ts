import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IProducto } from "../../interfaces";

@Component({
  selector: "app-producto-table",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./producto-table.component.html",
  styleUrl: "./producto-table.component.scss",
})
export class ProductListComponent {
  @Input() productos: IProducto[] = [];
  @Input() areActionsAvailable: boolean = false;
  @Output() callEditMethod: EventEmitter<IProducto> = new EventEmitter<IProducto>();
  @Output() callDeleteMethod: EventEmitter<IProducto> = new EventEmitter<IProducto>();
}