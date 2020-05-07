import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login/login.page';
import { RegisterPage } from './register/register.page';
import { MyTicketsPage } from './my-tickets/my-tickets.page';
import { EventsAvailablePage } from './events-available/events-available.page';

import { AuthGuard } from './services/auth/auth.guard';
import { AnonymousLayoutComponent } from './components/anonymous-layout.component';
import { AuthenticatedLayoutComponent } from './components/authenticated-layout.component';

const routes: Routes = [
  // Rutas app
  {
    path: '',
    component: AnonymousLayoutComponent,
    children: [
      // De momento el path / redirige a /login
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login', component: LoginPage, data: {title: 'Login'} },
      { path: 'crear-cuenta', component: RegisterPage, data: {title: 'Crear cuenta'} }
    ]
  },
  {
    path: '',
    component: AuthenticatedLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'mis-entradas', component: MyTicketsPage, data: {title: 'Mis entradas'} },
      { path: 'eventos-disponibles', component: EventsAvailablePage, data: {title: 'Eventos disponibles'} },
      // Si esta logeado y accede a una ruta que no existe, se redirige a /mis-entradas
      { path: '**', redirectTo: 'mis-entradas' }
    ]
  },
  // De momento las rutas que no existen se redirigen a /login
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
