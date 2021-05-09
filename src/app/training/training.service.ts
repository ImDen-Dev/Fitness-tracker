import { ExerciseModel } from './exercise.model';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Select, Store } from '@ngxs/store';

import { UIService } from '../shared/ui.service';
import { StartLoading, StopLoading } from '../shared/ui.actions';

import { TrainingState } from './training.state';
import {
  SetAvailableTrainings,
  SetFinishedTrainings,
  StartTraining,
  StopTraining,
} from './training.actions';
import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  private fbSubscription: Subscription[] = [];

  @Select(TrainingState.getActiveTraining)
  activeTraining$: Observable<ExerciseModel>;

  constructor(
    private fStore: AngularFirestore,
    private uiService: UIService,
    private store: Store
  ) {}

  fetchAvailableExercises(): void {
    this.store.dispatch(new StartLoading());
    this.fbSubscription.push(
      this.fStore
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map((docArray) => {
            return docArray.map((doc) => {
              const data = doc.payload.doc.data() as ExerciseModel;
              return {
                id: doc.payload.doc.id,
                ...data,
              };
            });
          })
        )
        .subscribe(
          (exercises) => {
            this.store.dispatch(new StopLoading());
            this.store.dispatch(new SetAvailableTrainings(exercises));
          },
          () => {
            this.store.dispatch(new StopLoading());
            this.uiService.showSnackbar(
              'Fetching exercises failed, please try again later',
              null,
              3000
            );
          }
        )
    );
  }

  startExercise(selectedId: string): void {
    this.store.dispatch(new StartTraining(selectedId));
  }

  completeExercise(): void {
    this.activeTraining$.pipe(take(1)).subscribe((ex) => {
      this.addDataToDB({
        ...ex,
        date: new Date(),
        state: 'completed',
      });
      this.store.dispatch(new StopTraining());
    });
  }

  canceledExercise(progress): void {
    this.activeTraining$.pipe(take(1)).subscribe((ex) => {
      this.addDataToDB({
        ...ex,
        date: new Date(),
        duration: ex.duration * (progress / 100),
        calories: ex.calories * (progress / 100),
        state: 'cancelled',
      });
      this.store.dispatch(new StopTraining());
    });
  }

  fetchCompletedOrCancelledExercises(): void {
    this.fbSubscription.push(
      this.fStore
        .collection('finishedExercises')
        .valueChanges()
        .subscribe((exercises: ExerciseModel[]) => {
          this.store.dispatch(new SetFinishedTrainings(exercises));
        })
    );
  }

  cancelSubscriptions(): void {
    this.fbSubscription.forEach((sub) => sub.unsubscribe());
  }

  private addDataToDB(exercise: ExerciseModel): void {
    this.fStore.collection<ExerciseModel>('finishedExercises').add(exercise);
  }
}
