import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthBusinessService } from '../services/auth-business/auth-business.service';
import { EventsService } from '../services/events/events.service';
import { LoadingBarService } from '@ngx-loading-bar/core';
import * as moment from 'moment';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.page.html',
  styleUrls: ['./create-event.page.css']
})
export class CreateEventPage implements OnInit {
  createEvent: FormGroup;
  minDate: moment.Moment;
  image: String = null;
  fileName: String = '';
  @ViewChild('uploadFile') uploadFile;

  constructor(public builder: FormBuilder, public snackBar: MatSnackBar, private router: Router, private authService: AuthBusinessService, private eventsService: EventsService, private loadingBar: LoadingBarService) {
    this.createEvent = this.builder.group({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
      starts: new FormControl('', [Validators.required]),
      ends: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      ticketsForSale: new FormControl('', [Validators.required])
    });
    // Asignamos la fecha mínima (hoy)
    this.minDate = moment();
  }

  ngOnInit(): void {}

  create() {    
    if (this.createEvent.valid) {
      let starts = this.createEvent.get('starts').value;
      let ends = this.createEvent.get('ends').value;
      if (starts.isAfter(ends)) {
        this.snackBar.open('La fecha de inicio no puede ser mayor que la de finalización', 'Aceptar', {duration: 2000});
        return;
      }
      
      let event = this.createEvent.value;
      event.business_id = this.authService.currentUser.business_id;
      // Si ha seleccionado una imagen la añadimos
      if (this.image != null) {
        event.image = this.image;
      }
      this.loadingBar.start();
      
      this.eventsService.createEvent(event)
        .subscribe((res: any) => {
          this.loadingBar.complete();
          this.router.navigate(['/negocios/mis-eventos']);
          this.snackBar.open(res.msg, 'Aceptar', {duration: 2000});
        }, (error: any) => {
          this.loadingBar.complete();
          let errorMsg = '';
          if (error.status == 403) {
            errorMsg = error.error.msg;
          } else {
            errorMsg = 'Error '+error.status+': '+error.statusText;
          }
          this.snackBar.open(errorMsg, 'Aceptar', {duration: 2000});
        });
    } else {
      this.snackBar.open('Faltan campos por rellenar', 'Aceptar', {duration: 2000});
    }
  }

  /**
   * Hace click al botón del input oculto tipo file para seleccionar una imagen
   */
  getFile() {
    this.uploadFile.nativeElement.click();
  }

  /**
   * Función que se ejecuta después de seleccionar una imagen
   * @param event - El evento de esta acción
   */
  onFileSelected(event) {
    this.fileName = event.target.files[0].name;
    const reader = new FileReader();
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.image = reader.result as string;
      };
    }
  }

}
