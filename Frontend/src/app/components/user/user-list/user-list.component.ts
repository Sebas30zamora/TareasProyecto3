import { Component, effect, EventEmitter, inject, Input, Output } from '@angular/core';
import { IUser } from '../../../interfaces';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  @Input() title: string  = '';
  @Input() users: IUser[] = [];
  @Output() callModalAction: EventEmitter<IUser> = new EventEmitter<IUser>();
  @Output() callDeleteAction: EventEmitter<IUser> = new EventEmitter<IUser>();
}
