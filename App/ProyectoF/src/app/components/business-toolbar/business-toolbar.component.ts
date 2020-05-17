import { Component, OnInit } from '@angular/core';
import { AuthBusinessService } from 'src/app/services/auth-business/auth-business.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToolbarTitleService } from 'src/app/services/toolbar-title/toolbar-title.service';

@Component({
  selector: 'app-business-toolbar',
  templateUrl: './business-toolbar.component.html',
  styleUrls: ['./business-toolbar.component.css']
})
export class BusinessToolbarComponent implements OnInit {
  title: string = '';
  fullName: string = '';

  constructor(public dialog: MatDialog, private toolbarTitleService: ToolbarTitleService, private authService: AuthBusinessService) { }

  ngOnInit(): void {
    this.toolbarTitleService.title.subscribe(updatedTitle => {
      this.title = updatedTitle;
    });
    this.fullName = this.authService.currentUser.name + ' ' + this.authService.currentUser.last_name;
  }

  openDialog(): void {
    this.dialog.open(LogoutDialog, { width: '400px', height: '150px' });
  }

}


@Component({
  selector: 'logout-dialog',
  template: ` <h1 mat-dialog-title>¿Desea cerrar la sesión?</h1>
              <div mat-dialog-content></div>
              <div mat-dialog-actions>
                <button mat-button (click)="closeDialog()">Cancelar</button>
                <button mat-button (click)="logout()">Aceptar</button>
              </div>`
})
export class LogoutDialog {
  constructor(private authService: AuthBusinessService, private router: Router, public dialogRef: MatDialogRef<LogoutDialog>) { }

  closeDialog() {
    this.dialogRef.close();
  }

  logout() {
    this.closeDialog();
    this.authService.logout();
    this.router.navigate(['/negocios/login']);
  }
}