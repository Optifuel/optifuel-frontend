import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { VehicleService } from '../../services/vehicle.service';
import { InputNumber } from 'primeng/inputnumber';

@Component({
  selector: 'app-vehicle-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, Select, InputNumber],
  providers: [VehicleService],
  templateUrl: './vehicle-selector.component.html',
  styleUrl: './vehicle-selector.component.scss'
})
export class VehicleSelectorComponent {

  public selectedVehicle: object | undefined;
  public tank: number = 100;
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
