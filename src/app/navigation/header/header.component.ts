import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Observable, Subscription } from 'rxjs';
import { Select } from '@ngxs/store';

import { AuthState } from '../../auth/auth.state';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() openSidenav = new EventEmitter<void>();
  isAuth = false;
  authSubscription: Subscription;

  @Select(AuthState.isAuthenticated) isAuth$: Observable<boolean>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // this.authSubscription = this.authService.authChange.subscribe(
    //   (authStatus) => {
    //     this.isAuth = authStatus;
    //   }
    // );
  }

  onOpenSidenav(): void {
    this.openSidenav.emit();
  }

  onLogout(): void {
    this.authService.logoutUser();
  }

  ngOnDestroy(): void {
    // if (this.authSubscription) {
    //   this.authSubscription.unsubscribe();
    // }
  }
}
