import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { StartLoading, StopLoading } from './ui.actions';

export interface LoadingStateModel {
  isLoading: boolean;
}

@State<LoadingStateModel>({
  name: 'loading',
  defaults: {
    isLoading: false,
  },
})
@Injectable()
export class UiState {
  @Selector()
  static isLoading(state: LoadingStateModel): boolean {
    return state.isLoading;
  }

  @Action(StartLoading)
  startLoading(ctx: StateContext<LoadingStateModel>): void {
    ctx.setState({
      isLoading: true,
    });
  }
  @Action(StopLoading)
  stopLoading(ctx: StateContext<LoadingStateModel>): void {
    ctx.setState({
      isLoading: false,
    });
  }
}
