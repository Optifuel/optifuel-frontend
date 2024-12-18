import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { VehicleService } from '../../services/vehicle.service';
import { ShellService } from '../../services/shell.service';
import { InputNumber } from 'primeng/inputnumber';

@Component({
  selector: 'app-vehicle-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, Select, InputNumber],
  providers: [VehicleService],
  templateUrl: './vehicle-selector.component.html',
  styleUrl: './vehicle-selector.component.scss',
})
export class VehicleSelectorComponent {
  public selectedVehicle: object | undefined;
  public tank: number = 100;
  public vehicles: any[] = [];
  constructor(
    private vehicleService: VehicleService,
    private shell: ShellService
  ) {}

  ngOnInit() {
    const email = localStorage.getItem('email');
    this.vehicleService.GetListVehicleByUser(email).subscribe((response) => {
      this.vehicles = response.data;
    });

  }

  public onVehicleChange(event: any) {
    this.shell.setSelectedVehicle(event.value);
    this.shell.setSelectedVehicle({
      ...this.selectedVehicle,
      tankLevel: this.tank,
    });
    this.selectedVehicle = event.value;
  }

  public onTankChange(event: any) {
    this.shell.setSelectedVehicle({
      ...this.selectedVehicle,
      tankLevel: event.value,
    });
  }

  public queryVehicles() {
    const email = localStorage.getItem('email');
    this.vehicleService.GetListVehicleByUser(email).subscribe((response) => {
      this.vehicles = response.data;
    });
  }
}
