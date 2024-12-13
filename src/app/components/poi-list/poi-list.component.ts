import { Component, ViewEncapsulation } from '@angular/core';
import { ShellService } from '../../services/shell.service';
import { CommonModule } from '@angular/common';
import { OrderListModule } from 'primeng/orderlist';
import { Button } from 'primeng/button';
@Component({
  selector: 'app-poi-list',
  standalone: true,
  imports: [CommonModule, OrderListModule, Button],
  templateUrl: './poi-list.component.html',
  styleUrl: './poi-list.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class PoiListComponent {

  public selectedPOIs: any[] = [];

  constructor(private shell: ShellService) { }

  ngOnInit() {
    this.shell.subscribeToEvent('addPOI', (poi: any) => {
      this.selectedPOIs.push(poi);
      console.log(this.selectedPOIs);
    });
  }
  
}
