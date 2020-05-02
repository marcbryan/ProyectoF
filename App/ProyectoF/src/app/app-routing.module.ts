import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login/login.page';
import { MyTicketsPage } from './my-tickets/my-tickets.page';

import { AuthGuard } from './services/auth/auth.guard';

const routes: Routes = [
  // De momento el path / redirige a /login
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // Rutas app
  { path: 'login', component: LoginPage, data: {title: 'Login'} },
  { path: 'mis-entradas', component: MyTicketsPage, data: {title: 'Mis entradas'}, canActivate: [AuthGuard] },
  // De momento las rutas que no existen se redirigen a /login
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
