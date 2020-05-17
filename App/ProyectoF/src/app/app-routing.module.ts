import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPage } from './login/login.page';
import { RegisterPage } from './register/register.page';
import { MyTicketsPage } from './my-tickets/my-tickets.page';
import { EventsAvailablePage } from './events-available/events-available.page';

import { AuthGuard } from './services/auth/auth.guard';
import { AuthBusinessGuard } from './services/auth-business/auth-business.guard';
import { AnonymousLayoutComponent } from './components/anonymous-layout.component';
import { AuthenticatedLayoutComponent } from './components/authenticated-layout.component';
import { AuthenticatedBusinessLayoutComponent } from './components/authenticated-business-user-layout.component';
import { BusinessLoginPage } from './business-login/business-login.page';
import { BusinessEventsPage } from './business-events/business-events.page';
import { CreateEventPage } from './create-event/create-event.page';
import { BusinessRegisterPage } from './business-register/business-register.page';
import { LandingPage } from './landing/landing.page';
import { ProjectInfoPage } from './project-info/project-info.page';

const routes: Routes = [
  // Rutas app
  {
    path: '',
    component: AnonymousLayoutComponent,
    children: [
      { path: '', component: LandingPage, data: {title: 'Bienvenido'} },
      { path: 'login', component: LoginPage, data: {title: 'Login'} },
      { path: 'crear-cuenta', component: RegisterPage, data: {title: 'Crear cuenta'} },
      { path: 'negocios/login', component: BusinessLoginPage, data: {title: 'Login Negocios'}},
      { path: 'negocios/registro', component: BusinessRegisterPage, data: {title: 'Registrar un negocio'}},
      { path: 'sobre-proyectof', component: ProjectInfoPage, data: {title: 'Sobre el proyecto' }}
    ]
  },
  {
    path: 'negocios',
    component: AuthenticatedBusinessLayoutComponent,
    canActivate: [AuthBusinessGuard],
    children: [
      { path: 'eventos', component: BusinessEventsPage, data: {title: 'Nuestros eventos'} },
      { path: 'crear-evento', component: CreateEventPage, data: {title: 'Crea un evento'} },
      { path: '**', redirectTo: 'eventos' }
    ],
    
  },
  {
    path: 'u',
    component: AuthenticatedLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'mis-entradas', component: MyTicketsPage, data: {title: 'Mis entradas'} },
      { path: 'eventos-disponibles', component: EventsAvailablePage, data: {title: 'Eventos disponibles'} },
      // Si esta logeado y accede a una ruta que no existe, se redirige a /mis-entradas
      { path: '**', redirectTo: 'mis-entradas' }
    ]
  },
  // Las rutas que no existen se redirigen a la landing page
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
