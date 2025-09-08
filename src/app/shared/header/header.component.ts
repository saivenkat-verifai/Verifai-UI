import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule  // ✅ Import RouterModule for routerLink and routerLinkActive
  ],

})
export class HeaderComponent {
  activeMenu = 'dashboard';

  ticketCount: number = 209;
  constructor(private router: Router) {}

  setActive(menu: string) {
    this.activeMenu = menu;
    this.router.navigate([menu]); // navigates to /dashboard, /events, etc.
  }
}
