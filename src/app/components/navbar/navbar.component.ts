import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Menubar } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ShellService } from '../../services/shell.service';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [Menubar],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent {
  items: MenuItem[] | undefined;

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService, private shell: ShellService) {}

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  ngOnInit() {
    this.items = [
      {
        label: 'OptiFuel',
        // icon: 'pi pi-home'
        command: () => {
          this.router.navigate(['/home']);
        }
      },
      {
        label: 'Vehicles',
        icon: 'pi pi-car',
        command: () => {
          this.router.navigate(['vehicles'], { relativeTo: this.route });
        },
      },
      {
        label: 'Guide',
        icon: 'pi pi-info-circle',
        command: () => {
          this.router.navigate(['guide'], { relativeTo: this.route });
        },
      },
      {
        label: 'Credits',
        icon: 'pi pi-envelope',
        command: () => {
          this.router.navigate(['credits'], { relativeTo: this.route });
        },
      },
      {
        separator: true,
      },
      {
        label: 'Account',
        icon: 'pi pi-user',
        command: () => {
          this.router.navigate(['account'], { relativeTo: this.route });
        },
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
          this.onLogout();
          this.shell.clearAll.next(true);
          this.shell.POIs.next([]);
        },
      },
    ];
  }
}
