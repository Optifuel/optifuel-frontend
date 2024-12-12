import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { DialogService } from '../../services/dialog.service';
import { ConfirmAccountComponent } from '../confirm-account/confirm-account.component';
import { Dialog } from 'primeng/dialog'; 
import { userService } from '../../services/user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, LoginComponent, RegisterComponent, Dialog, ConfirmAccountComponent],
  providers: [DialogService, MessageService, userService],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  isRegistered: boolean = true;
  confirmAccountDialog: boolean = false;

  constructor(
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.dialogService.currentConfirmDialog.subscribe(
      (confirmAccountDialog:any) =>
        (this.confirmAccountDialog = confirmAccountDialog)
    );
  }

  toggleRegistration() {
    this.isRegistered = !this.isRegistered;
  }

  showConfirmAccount() {
    this.dialogService.changeConfirmDialog(true);
  }

}
