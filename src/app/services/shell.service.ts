import { Injectable, EventEmitter } from '@angular/core';
@Injectable({
  providedIn: 'any'
})
export class ShellService {

  public events: Map<string, EventEmitter<any>> = new Map<string, EventEmitter<any>>();

  constructor() {}

  subscribeToEvent(event: string, callback: any): void {
    if (!this.events.has(event)) {
      this.events.set(event, new EventEmitter());
    }

    this.events.get(event)?.subscribe(callback);
  }

  emitEvent(event: string, data: any): void {
    if (this.events.has(event)) {
      this.events.get(event)?.emit(data);
    } else {
      this.events.set(event, new EventEmitter());
      this.events.get(event)?.emit(data);
    }
  }
}
