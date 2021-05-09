import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';
import { Store } from '@ngxs/store';
import { AuthState } from './auth.state';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isAuth = this.store.selectSnapshot<boolean>(
      AuthState.isAuthenticated
    );
    if (isAuth) {
      return true;
    } else {
      this.router.navigate(['/login']);
    }
  }

  canLoad(route: Route): boolean {
    const isAuth = this.store.selectSnapshot<boolean>(
      AuthState.isAuthenticated
    );
    if (isAuth) {
      return true;
    } else {
      this.router.navigate(['/login']);
    }
  }
}
