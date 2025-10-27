import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { IProducto } from "../../../interfaces";

@Component({
  selector: "app-product-list", 
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"], 
})
export class ProductListComponent {
  @Input() productos: IProducto[] = [];
  @Input() areActionsAvailable: boolean = false;
  @Output() callEditMethod: EventEmitter<IProducto> = new EventEmitter<IProducto>();
  @Output() callDeleteMethod: EventEmitter<IProducto> = new EventEmitter<IProducto>();
}
