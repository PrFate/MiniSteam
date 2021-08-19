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

  public editForm: FormGroup;
  public user: User | undefined;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    console.group('onInit profile');
    console.log(this.userService.user);
    console.groupEnd();
    this.user = this.userService.user;
    this.editForm = this.generateeditFormGroup();
  }

  public generateeditFormGroup() {
    return new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
      username: new FormControl(null),
      age: new FormControl(null)
    });
  }

  public submit() {

  }

}
