import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ICategoria } from "../../interfaces";

@Component({
  selector: "app-categoria-list",
  standalone: true,
  imports: [],
  templateUrl: "./categoria-lista.component.html",
  styleUrl: "./categoria-lista.component.scss",
})
export class CategoriaListaComponent {
  @Input() categorias: ICategoria[] = [];
  @Input() areActionsAvailable: boolean = false;
  @Output() callEditMethod: EventEmitter<ICategoria> =
    new EventEmitter<ICategoria>();
  @Output() callDeleteMethod: EventEmitter<ICategoria> =
    new EventEmitter<ICategoria>();
}