import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Button } from 'primeng/button';

import { AuthComponent } from '../../components/auth/auth.component';
import { ToastService } from '../../services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Button, AuthComponent],
  providers: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public showAuth = false;

  private URLSubscription: Subscription | undefined;

  constructor(private router: Router, private route: ActivatedRoute, private toastService: ToastService) {}

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
        const path = segments[0].path;
        this.showAuth = path === 'login' || path === 'register';
      });
    } else {
      this.showAuth = false;
    }
  }

  goToAuth() {
    this.router.navigate(['login'], { relativeTo: this.route });
  }
  
  backToHome() {
    this.router.navigate([''], { relativeTo: this.route });
  }

}