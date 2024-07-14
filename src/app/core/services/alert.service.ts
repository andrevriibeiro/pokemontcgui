import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() {}

  showSuccess(message: string, title: string = 'Success') {
    Swal.fire({
      icon: 'success',
      title: title,
      html: message,
    });
  }

  showError(message: string, title: string = 'Error') {
    Swal.fire({
      icon: 'error',
      title: title,
      html: message,
    });
  }

  showInfo(message: string, title: string = 'Info') {
    Swal.fire({
      icon: 'info',
      title: title,
      html: message,
    });
  }
}