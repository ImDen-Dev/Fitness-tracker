import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { ExerciseModel } from './exercise.model';
import {
  SetAvailableTrainings,
  SetFinishedTrainings,
  StartTraining,
  StopTraining,
} from './training.actions';

export interface TrainingStateModel {
  availableExercises: ExerciseModel[];
  finishedExercises: ExerciseModel[];
  activeTraining: ExerciseModel;
}

@State<TrainingStateModel>({
  name: 'trainings',
  defaults: {
    availableExercises: [],
    finishedExercises: [],
    activeTraining: null,
  },
})
@Injectable()
export class TrainingState {
  @Selector()
  static getAvailableExercises(state: TrainingStateModel): ExerciseModel[] {
    return state.availableExercises;
  }
  @Selector()
  static getFinishedExercises(state: TrainingStateModel): ExerciseModel[] {
    return state.finishedExercises;
  }
  @Selector()
  static getActiveTraining(state: TrainingStateModel): ExerciseModel {
    return state.activeTraining;
  }
  @Selector()
  static getIsTraining(state: TrainingStateModel): boolean {
    return state.activeTraining != null;
  }

  @Action(SetAvailableTrainings)
  setAvailableExercises(
    ctx: StateContext<TrainingStateModel>,
    action: SetAvailableTrainings
  ): TrainingStateModel {
    return ctx.patchState({
      availableExercises: [...action.payload],
    });
  }

  @Action(SetFinishedTrainings)
  setFinishedTrainings(
    ctx: StateContext<TrainingStateModel>,
    action: SetFinishedTrainings
  ): TrainingStateModel {
    return ctx.patchState({
      finishedExercises: [...action.payload],
    });
  }
  @Action(StartTraining)
  startTraining(
    ctx: StateContext<TrainingStateModel>,
    action: StartTraining
  ): TrainingStateModel {
    const state = ctx.getState();
    return ctx.patchState({
      activeTraining: {
        ...state.availableExercises.find((ex) => ex.id === action.payload),
      },
    });
  }

  @Action(StopTraining)
  stopTraining(ctx: StateContext<TrainingStateModel>): TrainingStateModel {
    return ctx.patchState({
      activeTraining: null,
    });
  }
}
