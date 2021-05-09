import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { AuthState } from '../../auth/auth.state';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css'],
})
export class SidenavListComponent {
  @Output() closeSidenav = new EventEmitter<void>();

  @Select(AuthState.isAuthenticated) isAuth$: Observable<boolean>;

  constructor(private authService: AuthService) {}

  onClose(): void {
    this.closeSidenav.emit();
  }

  onLogout(): void {
    this.onClose();
    this.authService.logoutUser();
  }
}
