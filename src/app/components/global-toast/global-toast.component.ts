import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
@Component({
  selector: 'app-global-toast',
  standalone: true,
  imports: [Toast],
  providers: [MessageService],
  templateUrl: './global-toast.component.html',
  styleUrl: './global-toast.component.scss'
})
export class GlobalToastComponent {
  constructor(public messageService: MessageService) {}
}
