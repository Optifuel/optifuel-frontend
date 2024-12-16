import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'any'
})
export class ShellService {

  public events: Map<string, EventEmitter<any>> = new Map<string, EventEmitter<any>>();

  public mapSpinning: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public POIs: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public confirmDialog: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {}

  addPOI(poi: any): void {
    const pois = this.POIs.value;

    pois.push(poi);
    this.POIs.next(pois);
  }

  removePOI(poi: any): void {
    const pois = this.POIs.value;

    const index = pois.findIndex((p: any) => p.id === poi.id);

    if (index !== -1) {
      pois.splice(index, 1);
      this.POIs.next(pois);
    }
  }

  startSpinningMap(): void {
    this.mapSpinning.next(true);
  }

  stopSpinningMap(): void {
    this.mapSpinning.next(false);
  }

  showConfirmDialog(): void {
    this.confirmDialog.next(true);
  }

  hideConfirmDialog(): void {
    this.confirmDialog.next(false);
  }

  subscribeToCustomEvent(event: string, callback: any): void {
    if (!this.events.has(event)) {
      this.events.set(event, new EventEmitter());
    }

    this.events.get(event)?.subscribe(callback);
  }

  emitCustomEvent(event: string, data: any): void {
    if (this.events.has(event)) {
      this.events.get(event)?.emit(data);
    } else {
      this.events.set(event, new EventEmitter());
      this.events.get(event)?.emit(data);
    }
  }
}
