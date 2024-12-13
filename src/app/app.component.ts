import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { GlobeComponent } from './components/globe/globe.component';
import { Toast } from 'primeng/toast';

import { MessageService } from 'primeng/api';
import { ToastService } from './services/toast.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule, GlobeComponent, Toast],
  providers: [HttpClient, MessageService, ToastService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'optifuel-frontend';
}
