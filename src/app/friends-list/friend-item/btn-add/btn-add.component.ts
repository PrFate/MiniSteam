import { Component, Input, OnInit } from '@angular/core';
import { Friend } from 'src/app/models/user.model';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-btn-add',
  templateUrl: './btn-add.component.html',
  styleUrls: ['./btn-add.component.scss']
})
export class BtnAddComponent implements OnInit {

  @Input('potentialFriend') friend: Friend | undefined;

  constructor(private userService: UserService) { }

  ngOnInit(): void {}

  sendFriendshipRequest() {
    console.group('sendFriendshipRequest()');
    this.userService.sugestFriendship(this.friend?.email as string);
    console.groupEnd();
  }

}
