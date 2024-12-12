import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';

import { GlobeComponent } from '../../components/globe/globe.component';
import { AuthComponent } from '../../components/auth/auth.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ButtonModule, GlobeComponent, AuthComponent, ToastModule],
  providers: [MessageService, ToastService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  // encapsulation: ViewEncapsulation.None
})
export class HomeComponent {
  public showAuth = false;

  constructor(private router: Router, private toastService: ToastService) {}

  goToAuth() {
    this.showAuth = !this.showAuth;
  }
}