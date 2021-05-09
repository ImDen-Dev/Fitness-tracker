import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

import { TrainingService } from '../training.service';
import { ExerciseModel } from '../exercise.model';
import { UiState } from '../../shared/ui.state';
import { TrainingState } from '../training.state';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit {
  @Select(UiState.isLoading) isLoading$: Observable<boolean>;
  @Select(TrainingState.getAvailableExercises) exercises$: Observable<
    ExerciseModel[]
  >;

  constructor(public trainingService: TrainingService) {}

  ngOnInit(): void {
    this.fetchExercises();
  }

  fetchExercises(): void {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm): void {
    this.trainingService.startExercise(form.value.exercise);
  }
}
