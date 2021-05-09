import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';

import { AuthDataModel } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';

import { StartLoading, StopLoading } from '../shared/ui.actions';
import { SetAuthenticated, SetUnauthenticated } from './auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated = false;
  authChange = new Subject<boolean>();

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store
  ) {}

  initAuthListener(): void {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.store.dispatch(new SetAuthenticated());
        // this.isAuthenticated = true;
        // this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.store.dispatch(new SetUnauthenticated());
        this.trainingService.cancelSubscriptions();
        // this.isAuthenticated = false;
        // this.authChange.next(false);
        this.router.navigate(['/login']);
      }
    });
  }

  registerUser(authData: AuthDataModel): void {
    this.store.dispatch(new StartLoading());
    this.afAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        this.store.dispatch(new StopLoading());
      })
      .catch((error) => {
        this.uiService.showSnackbar(error.message, null, 3000);
        this.store.dispatch(new StopLoading());
      });
  }

  loginUser(authData: AuthDataModel): void {
    this.store.dispatch(new StartLoading());

    this.afAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        this.store.dispatch(new StopLoading());
      })
      .catch((error) => {
        this.store.dispatch(new StopLoading());
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  logoutUser(): void {
    this.afAuth.signOut();
  }

  // isAuth(): boolean {
  //   return this.isAuthenticated;
  // }
}
