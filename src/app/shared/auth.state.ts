import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Loading } from '../auth.actions';

export interface LoadingStateModel {
  isLoading: boolean;
}

@State<LoadingStateModel>({
  name: 'Auth',
  defaults: {
    isLoading: false,
  },
})
@Injectable()
export class AuthState {
  @Selector()
  static isLoading(state: LoadingStateModel): boolean {
    return state.isLoading;
  }

  @Action(Loading)
  loading(ctx: StateContext<LoadingStateModel>, action: Loading): void {
    const state = ctx.getState();
    ctx.setState({
      isLoading: action.isLoading,
    });
  }
}
