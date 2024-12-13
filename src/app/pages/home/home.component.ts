import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router, private toastService: ToastService) {}

  goToAuth() {
    this.showAuth = !this.showAuth;
  }
}