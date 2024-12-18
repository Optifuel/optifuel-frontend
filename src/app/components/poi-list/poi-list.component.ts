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
    this.shell.clearGasStations();
    this.shell.clearNavigationPath();
    this.shell.clearSelectedVehicle();
    this.shell.clearPathCoordinates();
    this.shell.clearPOIs();
    this.shell.startSpinningMap();
    this.stations = [];
    this.shell.setClearAll();
  }

  public computePath() {
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
        (responseStations) => {
          this.shell.setGasStations(responseStations.data);
          if (responseStations) {
            // Add gas stations coordinates to coorinates and then sort by distance from start
            coordinates.push(
              ...responseStations.data.map(
                (station: any) => station.coordinates
              )
            );
            this.stations = responseStations.data;
            coordinates.sort((a: any, b: any) => {
              return (
                Math.sqrt(
                  Math.pow(a.latitude - coordinates[0].latitude, 2) +
                    Math.pow(a.longitude - coordinates[0].longitude, 2)
                ) -
                Math.sqrt(
                  Math.pow(b.latitude - coordinates[0].latitude, 2) +
                    Math.pow(b.longitude - coordinates[0].longitude, 2)
                )
              );
            });

            this.mapbox.GetPath(coordinates).subscribe((response) => {
              let routes = response.routes;
              let route = routes.sort(
                (a: any, b: any) => a.distance - b.distance
              );
              this.shell.setPathCoordinates(responseStations.data.coordinates);
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
              this.toast.showWarn("Warning", "No gas stations necessary");
            });
          }
        }
      );
  }
  private computeTotalCost() {
    this.shell.selectedVehicle.subscribe((vehicle) => {
      if (vehicle) {
        console.log(vehicle);
        this.totalCost = this.stations.reduce((acc, station) => {
          return acc + station.price * vehicle.litersTank;
        }, 0);
      }
    });
  }
}
