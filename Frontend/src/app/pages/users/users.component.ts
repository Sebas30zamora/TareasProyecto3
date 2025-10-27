import { Component, inject } from '@angular/core';
import { UserListComponent } from '../../components/user/user-list/user-list.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [UserListComponent, PaginationComponent, LoaderComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  public userService = inject(UserService);

  constructor() {
    this.userService.search.page = 1;
    this.userService.getAll();
  }
}
