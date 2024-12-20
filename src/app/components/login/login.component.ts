import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

// PrimeNG components imports
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { DialogModule } from 'primeng/dialog';

// Services imports
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { ShellService } from '../../services/shell.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Button,
    DialogModule,
    InputText,
    FloatLabel
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  public form: FormGroup;
  public showBox: boolean = true;

  private emailRegex: any = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  private userdata: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private toastService: ToastService,
    private shell: ShellService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailRegex),
      ]),
      password: new FormControl('', Validators.required),
    });
  }

  sendLoginRequest() {
    this.form.reset();
  }

  goToRegister() {
    this.router.navigate(['register'], { relativeTo: this.route.parent });
  }

  checkCorrectPassword() {
    this.userService.ProceedLogin(this.form.value).subscribe(
      (res) => {
        this.userdata = res;

        this.authService.login(this.userdata)

        // Redirect to dashbord
        this.router.navigate(['dashboard']);
      },
      (error) => {
        if (error.status === 400 && error.error.code === 101) {
          // User Not Found
          this.toastService.showError('Not found', "User not found");  
        } else if (error.status === 400 && error.error.code === 102) {
          // Account Must Be Activatesd
          this.toastService.showWarn('Warning', "Account must be activated");
          
          // Show confirm account dialog
          this.shell.showConfirmDialog();
        } else if (error.status === 400) {
          // Wrong Password
          this.toastService.showError('Error', "Wrong password");
        }
      }
    );
  }
}