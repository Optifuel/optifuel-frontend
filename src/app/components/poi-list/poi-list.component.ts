import { Component, ViewEncapsulation } from '@angular/core';
import { ShellService } from '../../services/shell.service';
import { CommonModule } from '@angular/common';
import { OrderListModule } from 'primeng/orderlist';
import { Button } from 'primeng/button';
import { MapboxService } from '../../services/mapbox.service';
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

  constructor(private shell: ShellService, private mapbox: MapboxService) {}

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
      .subscribe((response) => {
        this.shell.setGasStation(response.data);
      });
    this.mapbox.GetPath(coordinates).subscribe((response) => {
      let routes = response.routes;
      let route = routes.sort((a: any, b: any) => a.distance - b.distance);
      this.shell.setPathCoordinates(route[0].geometry.coordinates);
    });
  }
}
