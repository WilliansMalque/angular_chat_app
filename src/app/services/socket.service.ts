import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from '../../environments/environment';
import * as io from 'socket.io-client';

import { Router } from '@angular/router';
import { MensajeElement } from '../models/mensaje.model';


@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket: Socket;
  swal: any;
  serverConnected = false ;



  constructor( private router: Router) {}

  connect( token: string){

    const fcmToken = localStorage.getItem('fcmToken');

    this.socket = io(environment.socketUrl, {

      transports: ['websocket'],
      autoConnect: true,
      forceNew: true,
      query: {
        'x-token': token,
        'fcm-token': fcmToken,
      },

    });

    this.socket.on('disconnect', (payload: any) => {
      console.log('DESCONECTADO');
      this.serverConnected = false;
    });


    this.socket.on('connect', () => {
      console.log('CONECTADO!!!');
      this.serverConnected = true;
    });


  }

  disconnect(){
    this.socket.disconnect();
    this.socket.removeAllListeners();
  }

  enviarMensaje( mensaje: MensajeElement ){
    this.socket.emit('mensaje-personal', mensaje);
  }


  logOut(){
    this.disconnect();
    localStorage.removeItem('token');
    this.router.navigate(['login']);
  }
}
