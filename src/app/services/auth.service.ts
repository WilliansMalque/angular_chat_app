import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { UsuarioClass } from '../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';


import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  usuario: UsuarioClass;
  apiUrl = environment.apiUrl;

  constructor( private http: HttpClient, private router: Router) { }


  login(email: string, password: string, recordar = false ): Observable<boolean> {

    if ( recordar ) {
      localStorage.setItem('correo', email );
    } else {
      localStorage.removeItem( 'correo' );
    }

    const data = {email, password};
    const headers = {'Content-Type': 'application/json'};

    return this.http.post<boolean>(`${this.apiUrl}login/`, JSON.stringify(data), { headers})
    .pipe( map( (resp: any ) => {
      this.usuario = resp.usuario;
      this.guardarToken(resp.token);
      return resp;

    }), catchError( e => {
      return throwError(e);
    }));

  }

  register(nombre: string, email: string, password: string ): Observable<boolean> {

    const data = {nombre, email, password};
    const headers = {'Content-Type': 'application/json'};

    return this.http.post<boolean>(`${this.apiUrl}login/new`, JSON.stringify(data), { headers})
    .pipe( map( (resp: any ) => {
      this.usuario = resp.usuario;
      this.guardarToken(resp.token);
      return true;

    }), catchError( e => {
      return throwError(e);
    }));

  }

  isLoggedIn( ): Observable<boolean> {

    const token = localStorage.getItem('token');

    const headers = {'x-token': token};

    return this.http.get<boolean>(`${this.apiUrl}login/renew`, {headers})
    .pipe( map( (resp: any ) => {
      this.usuario = resp.usuario;
      this.guardarToken(resp.token);
      return true;

    }), catchError( e => {
      this.logOut();
      return throwError(e);
    }));
  }

  guardarToken(token: string){
    localStorage.setItem('token', token);
    return;
  }



  mostrarSwal( title: string, html: string, icon: SweetAlertIcon, confirmButtonText: string ) {
    Swal.fire({
      title,
      html,
      icon,
      confirmButtonText,
      confirmButtonColor: '#3669EB'
    }).then( ( result ) => {
      if ( result.value ) {
        return result.value;
      }
    });
  }


  logOut(){
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }
}
