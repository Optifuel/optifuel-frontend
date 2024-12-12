import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private editModeSource = new BehaviorSubject<boolean>(false);
  currentEditMode = this.editModeSource.asObservable();

  private showConfirmDialogSource = new BehaviorSubject<boolean>(false);
  currentConfirmDialog = this.showConfirmDialogSource.asObservable();

  private showChangePasswordViewSource = new BehaviorSubject<boolean>(false);
  currentChangePasswordView = this.showChangePasswordViewSource.asObservable();

  private showConfirmChangePasswordViewSource = new BehaviorSubject<boolean>(false);
  currentConfirmChangePasswordView = this.showConfirmChangePasswordViewSource.asObservable();

  private showAddVehicleViewSource = new BehaviorSubject<boolean>(false);
  currentAddVehicleView = this.showAddVehicleViewSource.asObservable();

  private editVehicleViewSource = new BehaviorSubject<number>(-1);
  currentEditVehicleView = this.editVehicleViewSource.asObservable();

  constructor() { }

  changeEditMode(mode: boolean) {
    this.editModeSource.next(mode);
  }

  changeConfirmDialog(mode: boolean) {
    this.showConfirmDialogSource.next(mode);
  }

  changePasswordFormView(mode: boolean) {
    this.showChangePasswordViewSource.next(mode);
  }

  changeConfirmPasswordFormView(mode: boolean) {
    this.showConfirmChangePasswordViewSource.next(mode);
  }

  changeAddVehicleView(mode: boolean) {
    this.showAddVehicleViewSource.next(mode);
  }

  changeEditVehicleView(mode: number) {
    this.editVehicleViewSource.next(mode);
  }

}
