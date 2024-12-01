import { Injectable } from '@angular/core';
import { UsuarioClass } from '../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { MensajeElement } from '../models/mensaje.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  usuarioPara: UsuarioClass;
  apiUrl = environment.apiUrl;
  mensajes: MensajeElement[] = [];

  constructor( private http: HttpClient) { }


  getMensajes( usuarioId: string): Observable<MensajeElement[]> {

    this.mensajes = [];

    const token = localStorage.getItem('token');

    const headers = {'x-token': token};

    return this.http.get<MensajeElement[]>(`${this.apiUrl}mensajes/${usuarioId}`, {headers})
    .pipe( map( (resp: any ) => {
      this.mensajes = resp.mensajes.reverse();
      return resp;

    }), catchError( e => {
      return throwError(e);
    }));
  }
}
