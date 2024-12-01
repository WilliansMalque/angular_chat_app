import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UsuarioClass } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  usuarios: UsuarioClass[] = [];
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }


  getUsuarios( ): Observable<UsuarioClass[]> {

    const token = localStorage.getItem('token');

    const headers = {'x-token': token};

    return this.http.get<UsuarioClass[]>(`${this.apiUrl}usuarios`, {headers})
    .pipe( map( (resp: any ) => {
      this.usuarios = resp.usuarios;
      return this.usuarios;

    }), catchError( e => {
      return throwError(e);
    }));
  }
}
