import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Friend, FriendRequest } from 'src/app/models/user.model';

@Component({
  selector: 'app-friend-item',
  templateUrl: './friend-item.component.html',
  styleUrls: ['./friend-item.component.scss']
})
export class FriendItemComponent implements OnInit {

  @Input() friend: Friend | undefined;
  @Input() type: 'friend' | 'newFriendRequest' | 'usersFriendRequest' | 'potentialFriend';
  @Input() request: FriendRequest | undefined;

  constructor() { }

  ngOnInit(): void {}

}
