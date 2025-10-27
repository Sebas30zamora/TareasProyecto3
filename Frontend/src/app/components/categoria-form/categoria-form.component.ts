import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ICategoria } from '../../interfaces';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './categoria-form.component.html',
  styleUrl: './categoria-form.component.scss'
})
export class CategoriaFormComponent {
  @Input() form!: FormGroup;
  @Output() callSaveMethod: EventEmitter<ICategoria> = new EventEmitter<ICategoria>()
}