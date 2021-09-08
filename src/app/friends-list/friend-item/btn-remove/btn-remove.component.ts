import { Component, Input, OnInit } from '@angular/core';
import { Friend } from 'src/app/models/user.model';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-btn-remove',
  templateUrl: './btn-remove.component.html',
  styleUrls: ['./btn-remove.component.scss']
})
export class BtnRemoveComponent implements OnInit {

  @Input() friend: Friend | undefined;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
  }

  deleteUserFromFriendList() {
    console.log('deleteUserFromFriendList()');
    console.dir(this.friend);
    this.userService.deleteUserFromFriendList(this.friend?.email as string);
  }

}
