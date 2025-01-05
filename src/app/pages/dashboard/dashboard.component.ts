import { Component, ViewEncapsulation } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SearchBoxComponent } from '../../components/search-box/search-box.component';
import { CommonModule } from '@angular/common';
import { Dialog } from 'primeng/dialog';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { Button } from 'primeng/button';
import { PoiListComponent } from '../../components/poi-list/poi-list.component';
import { VehicleSelectorComponent } from '../../components/vehicle-selector/vehicle-selector.component';
import { ShellService } from '../../services/shell.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, SearchBoxComponent, CommonModule, Dialog, Button, RouterOutlet, PoiListComponent, VehicleSelectorComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {
  public modalVisible = false;
  public modalTitle = '';
  private URLSubscription: Subscription | undefined;
  public pathComputed = false;
  constructor(private router: Router, private route: ActivatedRoute, private shell: ShellService) {}

  ngOnInit() {
    this.handlePathChange();

    // If route contains 'login or register' then show auth component
    this.router.events.subscribe(this.handlePathChange.bind(this));
  }

  ngDoCheck() {
    this.shell.pathComputed.subscribe((pathComputed) => {
      this.pathComputed = pathComputed;
    });
  }

  handlePathChange() {
    const childRoute = this.route.firstChild;

    if (childRoute) {
      this.URLSubscription?.unsubscribe();
      this.URLSubscription = childRoute.url.subscribe((segments) => {
        const path = this.capitalizeFirstLetter(segments[0].path);
        this.modalTitle = path;
        this.modalVisible = true;
      });
    } else {
      this.modalVisible = false;
    }
  }

  zoomOnRoute() {
    this.shell.setZoomOnRoute();
  }

  capitalizeFirstLetter(val: string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  onModalHide() {
    this.router.navigate(['/dashboard']);
  }
}