
export interface Usuario {
  ok: boolean;
  msg: string;
  usuario: UsuarioClass;
  token: string;
}

export interface UsuarioClass {
  online: boolean;
  nombre: string;
  email: string;
  uid: string;
  fcmToken: string;
}

