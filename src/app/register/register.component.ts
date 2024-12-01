import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';

import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  usuario = {
    nombre: '',
    correo: '',
    password: '',
  };

  constructor(private authService: AuthService, private spinner: NgxSpinnerService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(registerForm: NgForm){

    console.log(registerForm.value);

    if (registerForm.invalid) { return; }
    this.spinner.show();

    const nombre = registerForm.controls.nombre.value;
    const correo = registerForm.controls.correo.value;
    const password = registerForm.controls.password.value;

    this.authService.register(nombre, correo, password).subscribe(() => {

      this.router.navigate(['home']).then( () => this.spinner.hide() );
    }, (e: any) => {
      this.spinner.hide();
      this.authService.mostrarSwal('', e.error.msg, 'error', 'Entendido');
    });

  }
}
