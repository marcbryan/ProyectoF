import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginFormComponent } from './login-form/login-form.component';

import { AuthGuard } from './services/auth/auth.guard';
import { MyTicketsComponent } from './my-tickets/my-tickets.component';

const routes: Routes = [
  // De momento el path / redirige a /login
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  // Rutas app
  { path: 'login', component: LoginFormComponent, data: {title: 'Login'} },
  { path: 'mis-entradas', component: MyTicketsComponent, data: {title: 'Mis entradas'}, canActivate: [AuthGuard] },
  // De momento las rutas que no existen se redirigen a /login
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
