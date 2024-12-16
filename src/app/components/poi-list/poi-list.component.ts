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
  encapsulation: ViewEncapsulation.None
})
export class PoiListComponent {

  public selectedPOIs: any[] = [];

  constructor(private shell: ShellService, private mapbox: MapboxService) { }

  gotoPOI(poi: any) {
    this.shell.gotoPOI(poi);
  }

  deleteSelectedPOI(poi: any) {
    this.shell.removePOI(poi);
  }

  ngOnInit() {
    this.shell.POIs.subscribe(pois => {
      this.selectedPOIs = pois;
    });
  }
  public computePath() {
    console.log(this.selectedPOIs);
    /*
      Build the coordinates object:
      [
        {
          "latitude": value,
          "longitude": value
        },
        .
        .
        .
      ]
    */
    const coordinates = this.selectedPOIs.map(poi => {
      return {
        latitude: poi.geometry.coordinates[0],
        longitude: poi.geometry.coordinates[1]
      }
    });

    console.log(coordinates);
    
    this.mapbox.FindGasStation("FY915JV", 50, coordinates).subscribe((response) => {
      console.log(response);
    });
  }
  
}
