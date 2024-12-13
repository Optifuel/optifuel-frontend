import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Button } from 'primeng/button';

import { GlobeComponent } from '../../components/globe/globe.component';
import { AuthComponent } from '../../components/auth/auth.component';
import { ToastService } from '../../services/toast.service';

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

  constructor(private router: Router, private route: ActivatedRoute, private toastService: ToastService) {}

  ngOnInit() {
    // If route contains 'login or register' then show auth component
    this.router.events.subscribe(() => {
      
      const childRoute = this.route.firstChild;

      if (childRoute) {
        childRoute.url.subscribe((segments) => {
          const path = segments.map((segment) => segment.path).join('/');
          this.showAuth = path === 'login' || path === 'register';
        });
      } else {
        this.showAuth = false;
      }
    });
    
  }

  goToAuth() {
    this.router.navigate(['login'], { relativeTo: this.route });
  }
  
  backToHome() {
    this.router.navigate([''], { relativeTo: this.route });
  }

}