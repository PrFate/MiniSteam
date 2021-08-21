import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'MiniSteam';
  isUserAuthorized: Observable<boolean>;
  subscription: Subscription;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.isUserAuthorized = this.userService.isUserLoggedIn;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
