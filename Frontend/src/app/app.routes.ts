import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/auth/login/login.component";
import { AppLayoutComponent } from "./components/app-layout/app-layout.component";
import { SigUpComponent } from "./pages/auth/sign-up/signup.component";
import { UsersComponent } from "./pages/users/users.component";
import { AuthGuard } from "./guards/auth.guard";
import { AccessDeniedComponent } from "./pages/access-denied/access-denied.component";
import { AdminRoleGuard } from "./guards/admin-role.guard";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { GuestGuard } from "./guards/guest.guard";
import { IRoleType } from "./interfaces";
import { ProfileComponent } from "./pages/profile/profile.component";
import { GamesComponent } from "./pages/games/games.component";
import { OrdersComponent } from "./pages/orders/orders.component";
// import { PreferenceListPageComponent } from "./pages/preference-list/preference-list.component";
import { SportTeamComponent } from "./pages/sport-team/sport-team.component";
import { CategoriaComponent } from "./pages/categorias/categorias.component";
import { ProductoComponent } from "./pages/productos/productos.component";

export const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    canActivate: [GuestGuard],
  },
  {
    path: "signup",
    component: SigUpComponent,
    canActivate: [GuestGuard],
  },
  {
    path: "access-denied",
    component: AccessDeniedComponent,
  },
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "app",
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "app",
        redirectTo: "users",
        pathMatch: "full",
      },
      {
        path: "users",
        component: UsersComponent,
        canActivate: [AdminRoleGuard],
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin],
          name: "Users",
          showInSidebar: true,
        },
      },
      {
        path: "dashboard",
        component: DashboardComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: "Dashboard",
          showInSidebar: false,
        },
      },
      {
        path: "profile",
        component: ProfileComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: "profile",
          showInSidebar: false,
        },
      },
      {
        path: "orders",
        component: OrdersComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: "orders",
          showInSidebar: false,
        },
      },
      // {
      //   path: "preference-list",
      //   component: PreferenceListPageComponent,
      //   data: {
      //     authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
      //     name: "preference list",
      //     showInSidebar: false,
      //   },
      // },
      {
        path: "sport-team",
        component: SportTeamComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: "Sport Team",
          showInSidebar: false,
        },
      },
      {
        path: "categorias",
        component: CategoriaComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: "Categorias",
          showInSidebar: true,
        },
      },
      {
        path: "productos",
        component: ProductoComponent,
        data: {
          authorities: [IRoleType.admin, IRoleType.superAdmin, IRoleType.user],
          name: "Productos",
          showInSidebar: true,
        },
      },
    ],
  },
];