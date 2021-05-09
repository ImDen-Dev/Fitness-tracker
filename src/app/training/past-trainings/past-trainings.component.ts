import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Observable } from 'rxjs';

import { ExerciseModel } from '../exercise.model';
import { TrainingService } from '../training.service';
import { Select, Store } from '@ngxs/store';
import { TrainingState } from '../training.state';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css'],
})
export class PastTrainingsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = ['date', 'name', 'calories', 'duration', 'state'];
  dataSource = new MatTableDataSource<ExerciseModel>();

  @Select(TrainingState.getFinishedExercises) finishedExercises$: Observable<
    ExerciseModel[]
  >;

  constructor(private trainingService: TrainingService, private store: Store) {}

  ngOnInit(): void {
    this.finishedExercises$.subscribe((exercises) => {
      this.dataSource.data = exercises;
    });
    this.trainingService.fetchCompletedOrCancelledExercises();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  doFilter(filterValue: string): void {
    this.dataSource.filter = filterValue;
  }
}
