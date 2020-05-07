import { Component, OnInit, Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  title: string = '';

  constructor(public dialog: MatDialog, private toolbarTitleService: ToolbarTitleService) { }

  ngOnInit(): void {
    this.toolbarTitleService.title.subscribe(updatedTitle => {
      this.title = updatedTitle;
    });
  }

  openDialog(): void {
    this.dialog.open(ConfirmDialog, { width: '400px', height: '150px' });
  }
}


@Component({
  selector: 'confirm-dialog',
  template: ` <h1 mat-dialog-title>¿Desea cerrar la sesión?</h1>
              <div mat-dialog-content></div>
              <div mat-dialog-actions>
                <button mat-button (click)="closeDialog()">Cancelar</button>
                <button mat-button (click)="logout()">Aceptar</button>
              </div>`
})
export class ConfirmDialog {
  constructor(private authService: AuthService, private router: Router, public dialogRef: MatDialogRef<ConfirmDialog>) { }

  closeDialog() {
    this.dialogRef.close();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}


@Injectable()
export class ToolbarTitleService {
  title = new BehaviorSubject('');

  constructor() {}

  setTitle(title: string) {
    this.title.next(title);
  }
}