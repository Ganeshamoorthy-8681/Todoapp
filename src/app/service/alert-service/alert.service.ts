import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertComponentModel } from '../../components/alert/model/alert-model';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor () { }


  handleError(error: HttpErrorResponse): AlertComponentModel {
    const errorObject: AlertComponentModel = {
      title: error.name,
      message: error.message
    };
    return errorObject;
  }

}
