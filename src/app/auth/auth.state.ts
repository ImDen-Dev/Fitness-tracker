import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { SetAuthenticated, SetUnauthenticated } from './auth.actions';

export interface AuthStateModel {
  isAuthenticated: boolean;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
    isAuthenticated: false,
  },
})
@Injectable()
export class AuthState {
  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean {
    return state.isAuthenticated;
  }

  @Action(SetAuthenticated)
  setAuthenticated(ctx: StateContext<AuthStateModel>): void {
    ctx.setState({
      isAuthenticated: true,
    });
  }
  @Action(SetUnauthenticated)
  setUnauthenticated(ctx: StateContext<AuthStateModel>): void {
    ctx.setState({
      isAuthenticated: false,
    });
  }
}
