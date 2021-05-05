import { ExerciseModel } from './exercise.model';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UIService } from '../shared/ui.service';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  exerciseChanged = new Subject<ExerciseModel>();
  exercisesChanged = new Subject<ExerciseModel[]>();
  finishedExercisesChanged = new Subject<ExerciseModel[]>();
  private availableExercises: ExerciseModel[] = [];
  private runningExercise: ExerciseModel;
  private fbSubscription: Subscription[] = [];

  constructor(
    private firestore: AngularFirestore,
    private uiService: UIService
  ) {}

  fetchAvailableExercises(): void {
    this.uiService.loadingStateChanged.next(true);
    this.fbSubscription.push(
      this.firestore
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
            this.uiService.loadingStateChanged.next(false);
            this.availableExercises = exercises;
            this.exercisesChanged.next([...this.availableExercises]);
          },
          (error) => {
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackbar(
              'Fetching exercises failed, please try again later',
              null,
              3000
            );
            this.exercisesChanged.next(null);
          }
        )
    );
  }

  startExercise(selectedId: string): void {
    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id === selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise(): void {
    this.addDataToDB({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed',
    });
    this.exerciseChanged.next(null);
  }

  canceledExercise(progress): void {
    this.addDataToDB({
      ...this.runningExercise,
      date: new Date(),
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      state: 'cancelled',
    });
    this.exerciseChanged.next(null);
  }

  getRunningExercise(): ExerciseModel {
    return { ...this.runningExercise };
  }

  fetchCompletedOrCancelledExercises(): void {
    this.fbSubscription.push(
      this.firestore
        .collection('finishedExercises')
        .valueChanges()
        .subscribe((exercises: ExerciseModel[]) => {
          this.finishedExercisesChanged.next(exercises);
        })
    );
  }

  cancelSubscriptions(): void {
    this.fbSubscription.forEach((sub) => sub.unsubscribe());
  }

  private addDataToDB(exercise: ExerciseModel): void {
    this.firestore.collection<ExerciseModel>('finishedExercises').add(exercise);
  }
}
