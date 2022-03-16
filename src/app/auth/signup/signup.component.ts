import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSubs: Subscription;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSubs =  this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      });
  }

  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.createUser(form.value.email, form.value.password);
    this.isLoading = true
  }

  ngOnDestroy(): void {
    this.authStatusSubs.unsubscribe();
  }

}
