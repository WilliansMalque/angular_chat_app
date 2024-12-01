export interface Mensaje {
  ok: boolean;
  mensajes: MensajeElement[];
  miId: string;
  mensajesDe: string;
}

export interface MensajeElement {
  de: string;
  para?: string;
  mensaje: string;
  createdAt?: Date;
  updatedAt?: Date;
}
