import { Component, ViewEncapsulation } from '@angular/core';
import { ShellService } from '../../services/shell.service';
import { CommonModule } from '@angular/common';
import { OrderListModule } from 'primeng/orderlist';
import { Button } from 'primeng/button';
import { MapboxService } from '../../services/mapbox.service';
import { ToastService } from '../../services/toast.service';
@Component({
  selector: 'app-poi-list',
  standalone: true,
  imports: [CommonModule, OrderListModule, Button],
  providers: [MapboxService],
  templateUrl: './poi-list.component.html',
  styleUrl: './poi-list.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PoiListComponent {
  public selectedPOIs: any[] = [];
  public enableStartButton: boolean = false;
  public stations: any[] = [];
  public totalCost: number = 0;
  public pathComputed: boolean = false;
  public routeDistance: number = 0;
  public tripDuration: number = 0;

  constructor(
    private shell: ShellService,
    private mapbox: MapboxService,
    public toast: ToastService
  ) {}

  gotoPOI(poi: any) {
    this.shell.gotoPOI(poi);
  }

  deleteSelectedPOI(poi: any) {
    this.shell.removePOI(poi);
  }

  ngOnInit() {
    this.shell.POIs.subscribe((pois) => {
      this.selectedPOIs = pois;
    });

    this.shell.selectedVehicle.subscribe((vehicle) => {
      if (vehicle) {
        this.enableStartButton = true;
      } else {
        this.enableStartButton = false;
      }
    });
  }

  ngDoCheck() {
    this.shell.pathComputed.subscribe((pathComputed) => {
      this.pathComputed = pathComputed;
    });
  }

  public clearAll() {
    this.shell.clearMap.next(true);
    this.shell.pathComputed.next(false);
    this.shell.clearGasStations();
    this.shell.clearNavigationPath();
    this.shell.clearPathCoordinates();
    this.stations = [];
    this.shell.clearSelectedVehicle();
    this.shell.clearPOIs();
    this.shell.setClearAll();
  }
  private clearMap() {
    this.shell.clearGasStations();
    this.shell.clearNavigationPath();
    this.shell.clearPathCoordinates();
    this.stations = [];
  }

  public computePath() {
    this.clearMap();
    this.shell.clearMap.next(true);

    const coordinates = this.selectedPOIs.map((poi) => {
      return {
        latitude: poi.geometry.coordinates[1],
        longitude: poi.geometry.coordinates[0],
      };
    });

    this.mapbox
      .FindGasStation(
        this.shell.selectedVehicle.value.licensePlate,
        this.shell.selectedVehicle.value.tankLevel,
        coordinates
      )
      .subscribe(
        (response_station) => {
          if (response_station) {
            this.shell.setGasStations(response_station.data.station);
            this.stations = response_station.data.station;
            this.mapbox.GetPath(response_station.data.coordinates).subscribe((response) => {
              let routes = response.routes;
              let route = routes.sort(
                (a: any, b: any) => a.distance - b.distance
              );
              this.routeDistance = route[0].distance;
              // convert the routeDistance to km
              this.routeDistance = this.routeDistance / 1000;
              // conevert the trip time to hours
              this.tripDuration = route[0].duration;
              this.tripDuration = this.tripDuration / 3600;
              this.shell.setPathCoordinates(route[0].geometry.coordinates);
              this.computeTotalCost();
              this.shell.setPathComputed();
            });
          }
        },
        (error: any) => {
          if (error.error.code === 301) {
            this.toast.showError('Error', 'No vehicle found');
            return;
          } else if (error.error.code === 533) {
            this.mapbox.GetPath(coordinates).subscribe((response) => {
              let routes = response.routes;
              let route = routes.sort(
                (a: any, b: any) => a.distance - b.distance
              );
              this.shell.setPathCoordinates(route[0].geometry.coordinates);
              this.shell.setPathComputed();
              this.toast.showWarn('Warning', 'No gas stations necessary');
            });
          }
        }
      );
  }
  private computeTotalCost() {
    this.shell.selectedVehicle.subscribe((vehicle) => {
      if (vehicle) {
        this.totalCost = this.stations.reduce((acc, station) => {
          return acc + station.price * vehicle.litersTank;
        }, 0);
      }
    });
  }
}
