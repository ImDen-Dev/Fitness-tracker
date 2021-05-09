import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { UiState } from '../../shared/ui.state';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  maxDate: Date;

  @Select(UiState.isLoading) isLoading$: Observable<boolean>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  onSubmit(f: NgForm): void {
    const { email, password } = f.value;
    const user = { email, password };
    this.authService.registerUser(user);
  }

  ngOnDestroy(): void {}
}
