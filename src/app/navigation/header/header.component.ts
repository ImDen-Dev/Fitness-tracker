import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';

import { AuthState } from '../../auth/auth.state';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Output() openSidenav = new EventEmitter<void>();

  @Select(AuthState.isAuthenticated) isAuth$: Observable<boolean>;

  constructor(private authService: AuthService) {}

  onOpenSidenav(): void {
    this.openSidenav.emit();
  }

  onLogout(): void {
    this.authService.logoutUser();
  }
}
