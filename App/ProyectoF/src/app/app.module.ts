import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from './services/auth/auth.guard';
import { AuthBusinessGuard } from './services/auth-business/auth-business.guard';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AnonymousLayoutComponent } from './components/anonymous-layout.component';
import { AuthenticatedLayoutComponent } from './components/authenticated-layout.component';
import { AuthenticatedBusinessLayoutComponent } from './components/authenticated-business-user-layout.component';
import { ToolbarComponent, ConfirmDialog } from './components/toolbar/toolbar.component';
import { BusinessToolbarComponent, LogoutDialog } from './components/business-toolbar/business-toolbar.component';
import { EventCardComponent } from './components/event-card/event-card.component';
import { BusinessEventCardComponent } from './components/business-event-card/business-event-card.component';
import { EventInfoDialog } from './components/dialogs/event-info/event-info.dialog';
import { LoginPage } from './login/login.page';
import { RegisterPage } from './register/register.page';
import { MyTicketsPage } from './my-tickets/my-tickets.page';
import { EventsAvailablePage } from './events-available/events-available.page';
import { BusinessLoginPage } from './business-login/business-login.page';
import { BusinessEventsPage } from './business-events/business-events.page';
import { CreateEventPage } from './create-event/create-event.page';
import { BusinessRegisterPage } from './business-register/business-register.page';
import { ToolbarTitleService } from './services/toolbar-title/toolbar-title.service';
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
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDatetimepickerModule, MAT_DATETIME_FORMATS } from '@mat-datetimepicker/core';
import { MatMomentDatetimeModule } from '@mat-datetimepicker/moment';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { MatStepperModule } from '@angular/material/stepper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NumericDirective } from './numeric.directive';


@NgModule({
  declarations: [
    AppComponent,
    AnonymousLayoutComponent,
    AuthenticatedLayoutComponent,
    AuthenticatedBusinessLayoutComponent,
    BusinessToolbarComponent,
    ToolbarComponent,
    EventCardComponent,
    BusinessEventCardComponent,
    ConfirmDialog,
    LogoutDialog,
    EventInfoDialog,
    LoginPage,
    RegisterPage,
    MyTicketsPage,
    EventsAvailablePage,
    BusinessLoginPage,
    BusinessEventsPage,
    CreateEventPage,
    BusinessRegisterPage,
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
    MatProgressBarModule,
    MatDatepickerModule,
    MatMomentDatetimeModule,
    MatDatetimepickerModule,
    LoadingBarModule,
    LoadingBarHttpClientModule,
    MatStepperModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [Title, AuthGuard, AuthBusinessGuard, ToolbarTitleService, MatDatepickerModule, MatDatetimepickerModule,
    {
      provide: LOCALE_ID,
      useValue: "es-ES"
    },
    {
      provide: MAT_DATE_LOCALE,
      useExisting: LOCALE_ID
    },
    {
      provide: MAT_DATETIME_FORMATS,
      useValue: {
        parse: {
          dateInput: "L",
          monthInput: "MMMM",
          timeInput: "LT",
          datetimeInput: "L LT"
        },
        display: {
          dateInput: "L",
          monthInput: "MMMM",
          datetimeInput: "L LT",
          timeInput: "LT",
          monthYearLabel: "MMM YYYY",
          dateA11yLabel: "LL",
          monthYearA11yLabel: "MMMM YYYY",
          popupHeaderDateLabel: "ddd, DD MMM"
        }
      }
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ConfirmDialog, LogoutDialog]
})
export class AppModule { }
