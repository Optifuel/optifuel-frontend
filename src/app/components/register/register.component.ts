import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  FormControl,
  FormBuilder,
  Validators,
  AbstractControl,
  FormGroup,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { Select } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { userService } from '../../services/user.service';

interface driveLicences {
  name: string;
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

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, CalendarModule, InputText, FloatLabel, Button, Select, ReactiveFormsModule],
  providers: [DatePipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent {

  @Output() toggle = new EventEmitter<void>();
  @Output() showConfirmAccount = new EventEmitter<void>();

  showContinueButton = false;
  driveLicences: driveLicences[] | undefined;
  selectedDriveLicence: driveLicences | undefined;
  emailRegex: any = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  value: string | undefined;
  form: FormGroup;

  ngOnInit(): void {
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
  }

  onToggle() {
    this.toggle.emit();
  }
  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private messageService: MessageService,
    private userService: userService,
  ) {
    //Build the form
    this.form = this.fb.group(
      {
        name: new FormControl(
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(25),
          ])
        ),
        surname: new FormControl(
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
          ])
        ),
        email: new FormControl(
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(this.emailRegex),
          ])
        ),
        dateBirth: new FormControl<Date | null>(null, Validators.required),
        drivingLicense: new FormControl<driveLicences | null>(null),
        deadLine: new FormControl<Date | null>(null, Validators.required),
        businessName: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
        repeatPassword: new FormControl('', Validators.required),
      },
      { validator: passwordMatchValidator }
    );
  }

  proceedRegistration() {
    const tempDate = new Date(this.form.value.dateBirth);
    const tempDate2 = new Date(this.form.value.deadLine);
    this.form.patchValue({ dateBirth: tempDate });
    this.form.patchValue({ deadLine: tempDate2 });

    const toSend = {
      ...this.form.value,
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

    this.userService.AddUser(toSend).subscribe((data: any) => {
      console.log(data);
      sessionStorage.setItem('email', this.form.value.email);
      if (data.message === 'Success') {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Registration completed',
        });
        this.form.reset();
        this.showConfirmAccount.emit();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Registration failed',
        });
      }
    });
  }

  onContinue() {
    this.showContinueButton = !this.showContinueButton;
  }
}
