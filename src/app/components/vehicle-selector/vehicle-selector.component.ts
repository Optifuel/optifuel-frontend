import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-vehicle-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, Select, FloatLabel],
  providers: [VehicleService],
  templateUrl: './vehicle-selector.component.html',
  styleUrl: './vehicle-selector.component.scss'
})
export class VehicleSelectorComponent {

  // public vehicles: any[] = [
  //   { label: 'Car', value: 'car' },
  //   { label: 'Bike', value: 'bike' },
  //   { label: 'Truck', value: 'truck' }
  // ];

  public selectedVehicle: object | undefined;
  public vehicles: any[] = [];
  constructor(private vehicleService: VehicleService) { }

  ngOnInit(){
    const email = localStorage.getItem('email');
    this.vehicleService.GetListVehicleByUser(email).subscribe((response) => {
      this.vehicles = response.data;
      console.log(this.vehicles);
    });
  }


}
