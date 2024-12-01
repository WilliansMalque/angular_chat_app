import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';

import { NgxSpinnerService } from 'ngx-spinner';
import {  Router } from '@angular/router';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  usuario = {
    correo: '',
    password: '',
    recuerdame: false
  };

  constructor( private authService: AuthService, private spinner: NgxSpinnerService, private router: Router,
               private socketService: SocketService) { }

  ngOnInit(): void {
    this.usuario.correo = localStorage.getItem( 'correo' ) || '';
    if ( this.usuario.correo.length > 1 ) { this.usuario.recuerdame = true; }

    this.authService.isLoggedIn().subscribe(() => {
      this.router.navigate(['home']);
    }, () => this.router.navigate(['login']) );
  }

  onSubmit(loginForm: NgForm){


    if (loginForm.invalid) { return; }
    this.spinner.show();

    const correo = loginForm.controls.correo.value;
    const password = loginForm.controls.password.value;
    const recordar = loginForm.controls.recuerdame.value;


    this.authService.login(correo, password, recordar).subscribe(( resp: any) => {

      this.socketService.connect( resp.token );
      this.socketService.socket.emit('usuario-conectado', resp.usuario);

      this.router.navigate(['home']).then( () => this.spinner.hide() );

    }, () => {
      this.spinner.hide();
      this.authService.mostrarSwal('Login incorrecto', 'Revise sus credenciales nuevamente', 'error', 'Entendido');
    });




  }

}
