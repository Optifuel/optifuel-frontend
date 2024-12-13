import { Component } from '@angular/core';
import { GlobeComponent } from '../../components/globe/globe.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [GlobeComponent, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
