import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './services/auth/auth.guard';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AnonymousLayoutComponent } from './components/anonymous-layout.component';
import { AuthenticatedLayoutComponent } from './components/authenticated-layout.component';
import { ToolbarComponent, ConfirmDialog } from './components/toolbar/toolbar.component';
import { LoginPage } from './login/login.page';
import { RegisterPage } from './register/register.page';
import { MyTicketsPage } from './my-tickets/my-tickets.page';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NumericDirective } from './numeric.directive';


@NgModule({
  declarations: [
    AppComponent,
    AnonymousLayoutComponent,
    AuthenticatedLayoutComponent,
    ToolbarComponent,
    ConfirmDialog,
    LoginPage,
    RegisterPage,
    MyTicketsPage,
    NumericDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule,
    MatDialogModule,
    MatCardModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [Title, AuthGuard],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmDialog]
})
export class AppModule { }
