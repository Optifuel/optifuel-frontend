import { Component } from '@angular/core';
import { GlobeComponent } from '../../components/globe/globe.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SearchBoxComponent } from '../../components/search-box/search-box.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NavbarComponent, SearchBoxComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
