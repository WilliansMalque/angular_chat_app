import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';
import { UsuarioClass } from '../models/usuario.model';
import { ChatService } from '../services/chat.service';
import { SocketService } from '../services/socket.service';


@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})

export class PagesComponent implements OnInit {

  usuarios: UsuarioClass[] = [];


  constructor( public authService: AuthService, private router: Router, public usuarioService: UsuariosService,
               private chatService: ChatService, public socketService: SocketService) { }

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe((logged: boolean) => {
      if (!logged){
        this.cerrarSesion();
        return;
      }

      this.socketService.connect(localStorage.getItem('token'));
    });

    this.getUsuarios();
  }

  getUsuarios(){

    this.usuarioService.getUsuarios().subscribe(( usuarios: UsuarioClass[]) => {
      this.usuarioPara(this.usuarioService.usuarios[0]);
      this.usuarios = usuarios;
    });

  }

  usuarioPara(usuario: UsuarioClass){
    this.chatService.usuarioPara = usuario;

    this.chatService.getMensajes(this.chatService.usuarioPara.uid).subscribe(() => {
      this.router.navigate(['home']);

    });
  }

  cerrarSesion(){
    this.socketService.logOut();
  }


  applyFilter(filterValue: string) {

    const filter = filterValue.toLowerCase();

    const result = this.usuarioService.usuarios.filter(usuario  => {

      return usuario.nombre.toLowerCase().includes(filter);
    });

    this.usuarios = result;



  }

}
