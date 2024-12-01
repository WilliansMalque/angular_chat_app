import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { SocketService } from '../../services/socket.service';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('message') message: ElementRef;

  @ViewChild('scrollframe', {static: false}) scrollFrame: ElementRef;
  @ViewChildren('item') itemElements: QueryList<any>;

  usuarioId = '';
  messageToSend = '';
  loading = true;

    audio = new Audio();

  private scrollContainer: any;

  constructor( public authService: AuthService, private usuarioService: UsuariosService, private activatedRoute: ActivatedRoute,
               public chatService: ChatService, private socketservice: SocketService) {

    this.activatedRoute.params.subscribe( params => {

      this.usuarioId = params.id;
      this.loading = false;
      console.log('Ruta');
    });
  }

  ngOnInit(): void {
    this.usuarioId = this.authService.usuario.uid;

    this.socketservice.socket.on('mensaje-personal', (payload: any) => {

      this.playAudio( 'notification');

      const newMessage = {
        de: payload.de,
        para: payload.para,
        mensaje: payload.mensaje,
        createdAt: payload.createdAt
      };

      this.chatService.mensajes.push(newMessage);

      console.log('Mensaje Personal');
    });


    this.socketservice.socket.on('usuario-conectado', async (payload: any) => {

      const result =  await this.usuarioService.usuarios.findIndex(usuario => usuario.uid === payload.uid);

      if (result === -1 ) {return; }

      this.usuarioService.usuarios[result].online = true;

      this.playAudio( 'userConnected');

    });

    this.socketservice.socket.on('usuario-desconectado', (payload: any) => {

      const result = this.usuarioService.usuarios.findIndex(usuario => usuario.uid === payload);

      if (result === -1 ) {return; }

      this.usuarioService.usuarios[result].online = false;

    });


  }


  playAudio(sound: string){
    this.audio.src = `../../assets/sounds/${sound}.mp3`;
    this.audio.load();
    this.audio.play();
  }

  ngAfterViewInit() {

    setTimeout(() => {

      this.scrollContainer = this.scrollFrame.nativeElement;
      this.itemElements.changes.subscribe(_ => this.onItemElementsChanged());
      this.scrollToBottom();
    }, 1000);
  }

  triggerFunction(event: KeyboardEvent){
    if (event.key === 'Enter') {
      event.preventDefault();
      this.send();
    }
  }

  send(){

    this.messageToSend = this.messageToSend.trim();
    if (this.messageToSend === '' ) { return; }

    const newMessage = {
      de: this.authService.usuario.uid,
      mensaje: this.messageToSend,
      createdAt: new Date()
    };

    this.chatService.mensajes.push(newMessage);

    this.socketservice.socket.emit('mensaje-personal', {
      de: this.authService.usuario.uid,
      para: this.chatService.usuarioPara.uid,
      mensaje: this.messageToSend,
      createdAt: new Date()
    });

    this.messageToSend = '';
    this.message.nativeElement.focus();



  }

  private onItemElementsChanged(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }
}


