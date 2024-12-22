import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { VehicleService } from '../../services/vehicle.service';
import { ShellService } from '../../services/shell.service';

import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';

import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { DialogModule } from 'primeng/dialog';

import { AddVehicleComponent } from '../add-vehicle/add-vehicle.component';

@Component({
  selector: 'app-vehicles-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    SelectModule,
    TagModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    AddVehicleComponent,
  ],
  templateUrl: './vehicles-table.component.html',
  styleUrl: './vehicles-table.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class VehiclesTableComponent {
  public vehicles: any;

  addVehicleDialogVisible = false;
  newVehicle = {
    licensePlate: '',
    brand: '',
    model: '',
    fuelType: '',
    engineDisplacement: null,
    // Add other fields as necessary
  };

  constructor(
    private toastService: ToastService,
    private vehicleService: VehicleService,
    private shell: ShellService
  ) {}

  ngOnInit() {
    this.queryVehicleList();
    this.shell.showAddVehicleDialog.subscribe((value) => {
      this.addVehicleDialogVisible = value;
      this.queryVehicleList();
    });
  }

  private queryVehicleList() {
    this.vehicleService
      .GetListVehicleByUser(sessionStorage.getItem('email'))
      .subscribe(
        (data) => {
          this.vehicles = data.data;
        },
        (error) => {
          console.log('Error: ', error);
          this.toastService.showError('Error', 'Error loading vehicles');
        }
      );
  }

  fuelTypes = [
    { label: 'GPL', value: 'GPL' },
    { label: 'Petrol', value: 'Benzina' },
    { label: 'Diesel', value: 'Diesel' },
    { label: 'Methane', value: 'Metano' },
  ];

  onRowEditInit(vehicle: any) {
    console.log('Row edit initialized', vehicle);
  }

  onRowEditSave(vehicle: any) {
    vehicle.email = sessionStorage.getItem('email');
    console.log('Row edit saved', vehicle);
    this.vehicleService.EditVehicle(vehicle).subscribe(
      (data) => {
        console.log('Vehicle edited', data);
        this.toastService.showSuccess('Success', 'Vehicle edited');
      },
      (error) => {
        console.log('Error: ', error);
        this.toastService.showError('Error', 'Error editing vehicle');
      }
    );
  }

  onRowEditCancel(vehicle: any, index: number) {
    console.log('Row edit cancelled', vehicle);
  }

  showAddVehicleDialog() {
    this.addVehicleDialogVisible = true;
    this.newVehicle = {
      licensePlate: '',
      brand: '',
      model: '',
      fuelType: '',
      engineDisplacement: null,
      // Initialize other fields
    };
  }

  addVehicle() {
    // ADD VEHICLE
  }

  isNewVehicleValid() {
    return (
      this.newVehicle.licensePlate &&
      this.newVehicle.brand &&
      this.newVehicle.model &&
      this.newVehicle.fuelType &&
      this.newVehicle.engineDisplacement !== null
    );
  }

  deleteVehicle(vehicle: any) {
    console.log('Delete vehicle', vehicle);
    this.vehicleService
      .deleteVehicle(
        sessionStorage.getItem('email'),
        sessionStorage.getItem('token'),
        vehicle.licensePlate
      )
      .subscribe(
        (data) => {
          console.log('Vehicle deleted', data);
          this.toastService.showSuccess('Success', 'Vehicle deleted');
          this.vehicles = this.vehicles.filter(
            (item: any) => item.licensePlate !== vehicle.licensePlate
          );
        },
        (error) => {
          console.log('Error: ', error);
          this.toastService.showError('Error', 'Error deleting vehicle');
        }
      );
  }

  closeAddVehicleDialog() {
    this.shell.showAddVehicleDialog.next(false);
  }
}
