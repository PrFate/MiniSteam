import { Component, Input, OnInit } from '@angular/core';
import { FriendRequest } from 'src/app/models/user.model';

@Component({
  selector: 'app-btn-decline-accept',
  templateUrl: './btn-decline-accept.component.html',
  styleUrls: ['./btn-decline-accept.component.scss']
})
export class BtnDeclineAcceptComponent implements OnInit {

  @Input('friendRequest') request: FriendRequest | undefined;

  constructor() { }

  ngOnInit(): void {
    console.log('BtnDeclineAcceptComponent');
    console.dir(this.request);
  }

}
