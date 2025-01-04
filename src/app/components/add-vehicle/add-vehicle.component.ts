import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { VehicleService } from '../../services/vehicle.service';
import { ShellService } from '../../services/shell.service';

import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

import { SelectModule } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';

import { ButtonModule } from 'primeng/button';

import {
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-add-vehicle',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectModule,
    InputTextModule,
    FloatLabel,
    ButtonModule,
  ],
  templateUrl: './add-vehicle.component.html',
  styleUrl: './add-vehicle.component.scss',
})
export class AddVehicleComponent {
  vehicleForm: FormGroup;

  fuelTypes = [
    { label: 'GPL', value: 'GPL' },
    { label: 'Petrol', value: 'Benzina' },
    { label: 'Diesel', value: 'Diesel' },
    { label: 'Methane', value: 'Metano' },
  ];

  constructor(
    private fb: FormBuilder,
    private toastService: ToastService,
    private vehicleService: VehicleService,
    private shell: ShellService
  ) {
    this.vehicleForm = this.fb.group({
      businessName: ['', [Validators.required, Validators.maxLength(50)]],
      brand: ['', [Validators.required, Validators.maxLength(50)]],
      model: ['', [Validators.required, Validators.maxLength(50)]],
      licensePlate: ['', [Validators.required, Validators.maxLength(10)]],
      fuelType: [null],
      km: ['', [Validators.pattern(/^\d+$/)]],
      weight: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
      maxLoad: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
      litersTank: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
      engineDisplacement: ['', [Validators.pattern(/^\d+$/)]],
      urbanConsumption: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
      extraUrbanConsumption: ['', [Validators.pattern(/^\d+(\.\d+)?$/)]],
    });
  }

  ngOnInit(): void {
    this.shell.showAddVehicleDialog.subscribe((value) => {
      if (!value) {
        this.vehicleForm.reset();
      }
    });
  }

  onAddVehicle() {
    this.vehicleForm.value.email = sessionStorage.getItem('email');
    this.vehicleService.AddVehicle(this.vehicleForm.value).subscribe(
      (data) => {
        console.log(this.vehicleForm.value);
        this.toastService.showSuccess('Success', 'Vehicle added successfully');
        this.vehicleForm.reset();
        this.shell.showAddVehicleDialog.next(false);
      },
      (error) => {
        console.log('Error: ', error);
        this.toastService.showError('Error', 'Error adding vehicle');
      }
    );
  }
  closeAddVehicleDialog() {
    this.vehicleForm.reset();
  }
}
