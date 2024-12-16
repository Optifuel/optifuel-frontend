import { Component, ViewEncapsulation } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SearchBoxComponent } from '../../components/search-box/search-box.component';
import { Dialog } from 'primeng/dialog';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { PoiListComponent } from '../../components/poi-list/poi-list.component';
import { VehicleSelectorComponent } from '../../components/vehicle-selector/vehicle-selector.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, SearchBoxComponent, Dialog, RouterOutlet, PoiListComponent, VehicleSelectorComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent {
  public modalVisible = false;
  public modalTitle = '';
  private URLSubscription: Subscription | undefined;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.handlePathChange();

    // If route contains 'login or register' then show auth component
    this.router.events.subscribe(this.handlePathChange.bind(this));
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

  capitalizeFirstLetter(val: string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  }

  onModalHide() {
    this.router.navigate(['/dashboard']);
  }
}