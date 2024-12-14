import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { GlobeComponent } from './components/globe/globe.component';
import { NavigatorComponent } from './components/navigator/navigator.component';
import { Toast } from 'primeng/toast';

import { MessageService } from 'primeng/api';
import { ToastService } from './services/toast.service';
import { ShellService } from './services/shell.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    CommonModule,
    GlobeComponent,
    NavigatorComponent,
    Toast,
  ],
  providers: [HttpClient, MessageService, ToastService, ShellService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'optifuel-frontend';
  // selectedPOIs: any[] = [];
  // showNavigator = false;
  // constructor(private shell: ShellService) {}
  // ngOnInit() {
  //   this.shell.subscribeToEvent('addPOI', (poi: any) => {
  //     this.selectedPOIs.push(poi);
  //     // stop spinning when a POI is added
  //     if (this.selectedPOIs.length > 0) {
  //       this.showNavigator = true;
  //       console.log(
  //         'Latitude: ' +
  //           poi.geometry.coordinates[1] +
  //           ' Longitude: ' +
  //           poi.geometry.coordinates[0]
  //       );
  //     }
  //   });
  // }
}
