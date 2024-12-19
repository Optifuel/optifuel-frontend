import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'any'
})
export class ShellService {

  public events: Map<string, EventEmitter<any>> = new Map<string, EventEmitter<any>>();

  public gotoPOIEvent: EventEmitter<any> = new EventEmitter<any>();

  public mapSpinning: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  public POIs: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public confirmDialog: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public navigationPath: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  public selectedVehicle: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  public pathCoordinates: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  public gasStations: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  public clearAll: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public clearMap: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  public zoomOnRoute: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public pathComputed: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {}

  updateNavigationPath(path: any): void {
    this.navigationPath.next(path);
  }

  clearNavigationPath(): void {
    this.navigationPath.next(null);
  }

  gotoPOI(poi: any): void {
    this.gotoPOIEvent.emit(poi);
  }

  addPOI(poi: any): void {
    const pois = this.POIs.value;

    pois.push(poi);
    this.POIs.next(pois);
  }

  removePOI(poi: any): void {
    const pois = this.POIs.value;

    const index = pois.findIndex((p: any) => p.properties.mapbox_id === poi.properties.mapbox_id);

    if (index !== -1) {
      pois.splice(index, 1);
      this.POIs.next(pois);
    }
  }

  clearPOIs(): void {
    this.POIs.next([]);
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

  setSelectedVehicle(vehicle: any): void {
    this.selectedVehicle.next(vehicle);
  };

  clearSelectedVehicle(): void {
    this.selectedVehicle.next(null);
  };

  setPathCoordinates(coordinates: any): void {
    this.pathCoordinates.next(coordinates);
  };

  clearPathCoordinates(): void {
    this.pathCoordinates.next(null);
  };

  setGasStations(coordinates: any): void {
    this.gasStations.next(coordinates);
  };

  clearGasStations(): void {
    this.gasStations.next(null);
  };

  setClearAll(): void {
    this.clearAll.next(true);
  };

  negateClearAll(): void {
    this.clearAll.next(false);
  };
  
  setZoomOnRoute(): void {
    this.zoomOnRoute.next(true);
  }

  setPathComputed(): void {
    this.pathComputed.next(true);
  };

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
