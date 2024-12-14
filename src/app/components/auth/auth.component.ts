import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { ConfirmAccountComponent } from '../confirm-account/confirm-account.component';

import { Dialog } from 'primeng/dialog'; 
import { MessageService } from 'primeng/api';

import { UserService } from '../../services/user.service';
import { DialogService } from '../../services/dialog.service';
import { ShellService } from '../../services/shell.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Dialog, ConfirmAccountComponent],
  providers: [DialogService, MessageService, UserService],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AuthComponent {
  isRegistered: boolean = true;
  confirmAccountDialog: boolean = false;

  constructor(
    private dialogService: DialogService,
    private shell: ShellService
  ) {}

  ngOnInit() {
    this.dialogService.currentConfirmDialog.subscribe(
      (confirmAccountDialog:any) =>
        (this.confirmAccountDialog = confirmAccountDialog)
    );

    this.shell.subscribeToEvent('showConfirmDialog', () => {
      this.dialogService.changeConfirmDialog(true);
    });
  }

}
