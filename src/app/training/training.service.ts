import { ExerciseModel } from './exercise.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrainingService {
  exerciseChanged = new Subject<ExerciseModel>();
  private availableExercises: ExerciseModel[] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 },
  ];

  private runningExercise: ExerciseModel;
  private exercises: ExerciseModel[] = [];

  getAvailableExercises(): ExerciseModel[] {
    return this.availableExercises.slice();
  }

  startExercise(selectedId: string): void {
    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id === selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise(): void {
    this.exercises.push({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed',
    });
    this.exerciseChanged.next(null);
    console.log(this.exercises);
  }

  canceledExercise(progress): void {
    this.exercises.push({
      ...this.runningExercise,
      date: new Date(),
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      state: 'canceled',
    });
    this.exerciseChanged.next(null);
    console.log(this.exercises);
  }

  getRunningExercise(): ExerciseModel {
    return { ...this.runningExercise };
  }

  getCompletedOrCancelledExercises(): ExerciseModel[] {
    return this.exercises.slice();
  }
}
