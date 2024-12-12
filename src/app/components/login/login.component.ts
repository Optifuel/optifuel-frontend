import { Output, EventEmitter } from '@angular/core';
import { Component, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ConfirmAccountComponent } from '../confirm-account/confirm-account.component';

// PrimeNG components imports
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { DialogModule } from 'primeng/dialog';

// Services imports
import { userService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Button,
    DialogModule,
    InputText,
    FloatLabel,
    ConfirmAccountComponent,
  ],
  providers: [userService, ToastService],
  animations: [],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  @Output() toggle = new EventEmitter<void>();
  @Output() showConfirmAccount = new EventEmitter<void>();

  emailRegex: any = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  form: FormGroup;
  showBox: boolean = true;
  userdata: any;
  confirmAccountDialog: boolean = false;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: userService,
    private toastService: ToastService
  ) {
    this.form = this.fb.group({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailRegex),
      ]),
      password: new FormControl('', Validators.required),
    });
  }

  onToggle() {
    this.toggle.emit();
    this.showBox = !this.showBox;
  }

  sendLoginRequest() {
    console.log(this.form.value);
    this.form.reset();
  }

  checkCorrectPassword() {
    this.userService.ProceedLogin(this.form.value).subscribe(
      (res) => {
        this.userdata = res;
        sessionStorage.setItem('email', this.userdata.data.email);
        sessionStorage.setItem('token', this.userdata.data.token);
        sessionStorage.setItem('user', JSON.stringify(this.userdata.data));
        this.router.navigate(['/gestione']);
      },
      (error) => {
        if (error.status === 400 && error.error.code === 101) {
          this.toastService.showError('Not found', "User not found");  
        } else if (error.status === 400 && error.error.code === 102) {
          this.toastService.showWarn('Warning', "Account must be activated");
          this.showConfirmAccount.emit();
        } else if (error.status === 400) {
          this.toastService.showError('Error', "Wrong password");
        }
      }
    );
  }
}