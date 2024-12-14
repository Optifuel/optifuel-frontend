import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { UserService } from "../../services/user.service";
import { DialogService } from "../../services/dialog.service";
import { ButtonModule } from 'primeng/button';
import { ToastService } from '../../services/toast.service';
import { Toast } from 'primeng/toast';
import { InputOtp } from 'primeng/inputotp';


@Component({
  selector: 'app-confirm-account',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, InputOtp],
  templateUrl: './confirm-account.component.html',
  styleUrl: './confirm-account.component.scss'
})
export class ConfirmAccountComponent {
  
  public confirmCode: string | undefined;
  public confirmEmailForm: FormGroup;
  public confirmAccountDialog: boolean = false;
  
  constructor(
    private userService: UserService,
    private toastService: ToastService,
    private router: Router,
    private dialogsService: DialogService,
    private fb: FormBuilder
  ) {
    this.confirmEmailForm = this.fb.group({
      confirmCode: [null, [Validators.required, Validators.minLength(6)]],
    })
  }

  ngOnInit(): void {
    this.dialogsService.currentConfirmDialog.subscribe(
      (confirmAccountDialog) =>
        (this.confirmAccountDialog = confirmAccountDialog)
    );
  }

  confirmEmail() {
    const email = sessionStorage.getItem('email');
    
    this.confirmEmailForm?.reset();
    
    this.userService
      .verifyEmail(email, this.confirmEmailForm?.value.confirmCode)
      .subscribe((data: any) => {
        console.log(data.message);
        
        if (data.message === 'Success') {
          this.toastService.showSuccess('Success', 'Your account has been verified');
          
          sessionStorage.removeItem('email');
          this.dialogsService.changeConfirmDialog(false);
          
          this.router.navigate(['/dashboard']);
        } else {
          this.toastService.showError('Error', 'Your account has not been verified');
        }
      });
  }
}
