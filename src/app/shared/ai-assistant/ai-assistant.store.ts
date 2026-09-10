import { Injectable, signal } from '@angular/core';
import { createId } from '../../core/utils/create-id';

export interface AiMessage {
  readonly id: string;
  readonly role: 'user' | 'assistant';
  readonly text: string;
}

const WELCOME_MESSAGE: AiMessage = {
  id: createId('msg'),
  role: 'assistant',
  text: 'Hola, soy el asistente del LIMS. Dime la acción que quieres realizar.',
};

const MOCK_REPLIES = [
  'Todavía no estoy conectado a un modelo real: esto es una respuesta simulada mientras se define la integración.',
  'Puedo ayudarte a navegar el LIMS en cuanto esté conectado a un proveedor de IA. Por ahora solo simulo la conversación.',
  'Anotado. Cuando se conecte la IA, aquí podré ejecutar acciones como crear peticiones o abrir informes.',
];

/** Estado global del panel de asistente IA. Respuestas simuladas hasta conectar un proveedor real. */
@Injectable({ providedIn: 'root' })
export class AiAssistantStore {
  private readonly _open = signal(false);
  readonly open = this._open.asReadonly();

  private readonly _messages = signal<AiMessage[]>([WELCOME_MESSAGE]);
  readonly messages = this._messages.asReadonly();

  private readonly _thinking = signal(false);
  readonly thinking = this._thinking.asReadonly();

  toggle(): void {
    this._open.update((value) => !value);
  }

  setOpen(value: boolean): void {
    this._open.set(value);
  }

  send(text: string): void {
    const trimmed = text.trim();
    if (!trimmed || this._thinking()) {
      return;
    }

    this._messages.update((messages) => [...messages, { id: createId('msg'), role: 'user', text: trimmed }]);
    this._thinking.set(true);

    const reply = MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
    setTimeout(() => {
      this._messages.update((messages) => [...messages, { id: createId('msg'), role: 'assistant', text: reply }]);
      this._thinking.set(false);
    }, 600);
  }
}
