import { ExerciseModel } from './exercise.model';

export class SetAvailableTrainings {
  static readonly type = '[Training] Set Available Trainings';
  constructor(public payload: ExerciseModel[]) {}
}
export class SetFinishedTrainings {
  static readonly type = '[Training] Set Finished Trainings';
  constructor(public payload: ExerciseModel[]) {}
}
export class StartTraining {
  static readonly type = '[Training] Start Training';
  constructor(public payload: string) {}
}
export class StopTraining {
  static readonly type = '[Training] Stop Training';
}
