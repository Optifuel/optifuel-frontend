import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { VehicleService } from '../../services/vehicle.service';


@Component({
  selector: 'app-vehicles-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicles-table.component.html',
  styleUrl: './vehicles-table.component.scss',
})
export class VehiclesTableComponent {
  public vehicles: any;

  constructor(
    private userService: UserService,
    private toastService: ToastService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit() {
    this.vehicleService
      .GetListVehicleByUser(sessionStorage.getItem('email'))
      .subscribe(
        (data) => {
          this.vehicles = data.data;
          console.log(this.vehicles);
        },
        (error) => {
          console.log('Error: ', error);
          this.toastService.showError('Error', 'Error loading vehicles');
        }
      );
  }
}
