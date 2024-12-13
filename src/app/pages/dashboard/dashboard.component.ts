import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SearchBoxComponent } from '../../components/search-box/search-box.component';
import { Dialog } from 'primeng/dialog';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, SearchBoxComponent, Dialog, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  public modalVisible = false;
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
        // const path = segments[0].path;
        this.modalVisible = true;
      });
    } else {
      this.modalVisible = false;
    }
  }

  onModalHide() {
    this.router.navigate(['/dashboard']);
  }
}