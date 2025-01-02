import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ShellService } from '../../services/shell.service';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { DialogService } from '../../services/dialog.service';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { Calendar } from 'primeng/calendar';
import { Select } from 'primeng/select';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmAccountComponent } from "../../components/confirm-account/confirm-account.component";
import { Dialog } from 'primeng/dialog'; 

import {
  FormControl,
  FormBuilder,
  Validators,
  AbstractControl,
  FormGroup,
} from '@angular/forms';

interface driveLicences {
  name: string;
}

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    InputText,
    Button,
    FloatLabel,
    Calendar,
    Select,
    Dialog,
    ReactiveFormsModule,
    ConfirmAccountComponent
  ],
  providers: [DatePipe],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent {
  public user: any;
  public driveLicences: driveLicences[] | undefined;
  public form: FormGroup;
  public editMode: boolean = true;
  public confirmAccountDialog: boolean = false;

  constructor(
    private shell: ShellService,
    private userService: UserService,
    private toastService: ToastService,
    private dialogService: DialogService,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ) {
    this.user = sessionStorage.getItem('user');
    if (this.user) {
      this.user = JSON.parse(this.user);
      console.log(this.user);
    }
    this.form = this.fb.group(
      {
        name: new FormControl(this.user.name, Validators.required),
        surname: new FormControl(this.user.surname, Validators.required),
        dateBirth: new FormControl(
          new Date(this.user.dateBirth),
        ),
        drivingLicense: new FormControl(
          this.user.drivingLicense.type,
        ),
        deadLine: new FormControl(
          new Date(this.user.drivingLicense.deadLine),
        ),
        businessName: new FormControl(
          this.user.businessName,
        ),
        old_password: new FormControl(''),
        new_password: new FormControl(''),
      },
      { validators: passwordMatchValidator }
    );
  }

  ngOnInit() {
    this.driveLicences = [
      { name: 'B' },
      { name: 'C' },
      { name: 'C1' },
      { name: 'C1E' },
      { name: 'CE' },
      { name: 'D' },
      { name: 'D1' },
      { name: 'D1E' },
      { name: 'DE' },
    ];
    this.dialogService.currentConfirmDialog.subscribe(
      (confirmAccountDialog:any) =>
        (this.confirmAccountDialog = confirmAccountDialog)
    );

    this.shell.confirmDialog.subscribe((show) => {
      this.dialogService.changeConfirmDialog(show);
    });
  }
  editUser() {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach((field) => {
        const control = this.form.get(field);
        if (control?.invalid) {
          console.log(field, control.errors);
        }
      });
      return;
    }
    const email = sessionStorage.getItem('email');
    const user = {
      ...this.form.value,
      email: email,
      dateBirth: this.datePipe.transform(
        this.form.value.dateBirth,
        'yyyy-MM-dd'
      ),
      deadLine: this.datePipe.transform(this.form.value.deadLine, 'yyyy-MM-dd'),
      drivingLicense: {
        type: this.form.value.drivingLicense,
        deadLine: this.datePipe.transform(
          this.form.value.deadLine,
          'yyyy-MM-dd'
        ),
      },
    };
    this.userService.editUser(user).subscribe(
      (res) => {
        this.toastService.showSuccess('Success', 'User edited successfully');
        sessionStorage.setItem('user', JSON.stringify(user));
      },
      (err) => {
        console.log(err);
        this.toastService.showError('Error', err.error);
      }
    );
    // check if the password is changed and if so, check if the password match the repeat password and if so, send the request to the server
    if (this.form.value.old_password && this.form.value.new_password) {
      const data = {
        email: email,
        oldPassword: this.form.value.old_password,
        newPassword: this.form.value.new_password,
      };
      this.userService.changePasswordRequest(data).subscribe(
        (res) => {
          this.toastService.showSuccess(
            'Success',
            'Password changed successfully'
          );
          this.shell.showConfirmDialog();
          this.shell.changePwdDialog.next(true);
        },
        (err) => {
          console.log(err);
          this.toastService.showError('Error', err.error);
        }
      );
    }

  }
}
export function passwordMatchValidator(c: AbstractControl) {
  if (!c.get('password')?.value || !c.get('repeatPassword')?.value) {
    return null;
  }
  if (c.get('password')?.value !== c.get('repeatPassword')?.value) {
    return { passwordMismatch: true };
  }
  return null;
}
