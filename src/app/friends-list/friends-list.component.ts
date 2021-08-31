import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Friend, FriendRequest } from '../models/user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.scss']
})
export class FriendsListComponent implements OnInit {
  //******************* FIELD DECLARATIONS
  usersFriends$: Observable<Friend[] | undefined>;
  incomingRequests$: Observable<FriendRequest[] | undefined>;
  outgoingRequests$: Observable<FriendRequest[] | undefined>;
  discoveredPotentialFriends$: Observable<Friend[] | undefined>;
  // Active search flag
  noSearchIsInProgress = true;
  // temporary outgoingResContainer
  outgoingReqs: FriendRequest[] | undefined;
  incomingReqs: FriendRequest[] | undefined;

  userTextInput = new FormControl('');

  constructor(private userService: UserService) { }
  // lifecycle hooks
  ngOnInit(): void {
    this.usersFriends$ = this.userService.getUsersFriends(this.userService.user.email);

    this.userService.getUsersOutgoingRequests()
      .subscribe(val => {
        this.outgoingReqs = val;
      });

    this.userService.getUsersIncomingRequests()
      .subscribe(val => {
        this.incomingReqs = val;
      });

    this.userTextInput.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((value: string) => {
        if (value) {
          this.noSearchIsInProgress = false;
        } else {
          this.noSearchIsInProgress = true;
        }
        this.discoveredPotentialFriends$ = this.userService.findPotentialFriends(value);
      });
  }
}
