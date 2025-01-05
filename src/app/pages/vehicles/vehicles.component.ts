import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehiclesTableComponent } from '../../components/vehicles-table/vehicles-table.component';

import { VehicleService } from '../../services/vehicle.service';
import { UserService } from '../../services/user.service';
import { ShellService } from '../../services/shell.service';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, VehiclesTableComponent],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss'
})
export class VehiclesComponent {

  constructor(
    private vehicleService: VehicleService,
    private userService: UserService,
    private shell: ShellService
  ) {}

  ngOnInit() {
  }
  



}
