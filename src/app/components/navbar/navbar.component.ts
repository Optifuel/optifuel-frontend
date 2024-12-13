import { Component, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from '../../services/dialog.service';
import { Dialog } from 'primeng/dialog';
import { Avatar } from 'primeng/avatar';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [Avatar, Menubar],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent {
  items: MenuItem[] | undefined;

    ngOnInit() {
        this.items = [
            {
                label: 'OptiFuel',
                // icon: 'pi pi-home'
            },
            {
                label: 'Vehicles',
                icon: 'pi pi-car'
            },
            {
                label: 'Guide',
                icon: 'pi pi-info-circle'
            },
            {
                label: 'Project',
                icon: 'pi pi-github'
            },
            {
                label: 'Contacts',
                icon: 'pi pi-envelope'
            },
            {
                separator: true
            },
            {
                label: 'Account',
                icon: 'pi pi-user'
            },
            {
                label: 'Logout',
                icon: 'pi pi-sign-out'
            }
        ]
    }
}
