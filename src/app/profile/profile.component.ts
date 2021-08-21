import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../models/user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  editForm: FormGroup;
  user: User | undefined;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.user = this.userService.user;
    this.editForm = this.generateEditFormGroup();
  }


  generateEditFormGroup() {
    return new FormGroup({
      email: new FormControl(this.user?.email, [Validators.required, Validators.email]),
      password: new FormControl(this.user?.password, [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
      username: new FormControl(null),
      age: new FormControl(null)
    });
  }

  submit() {
    console.group('submit()');
    console.dir(this.editForm.value);
    console.groupEnd();
    const {email, password, username, age} = this.editForm.value;
    const res = this.userService.updateUser$(email, password, username, age);
    res.subscribe(() => console.log('did smth'));
  }

}
