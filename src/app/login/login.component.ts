import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {UserService} from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService) { }

  ngOnInit(): void {
    this.loginForm = this.generateLoginFormGroup();
  }

  generateLoginFormGroup() {
    return new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(20)])
    });
  }
  // TODO - add a display for error message in case if invalid properties were inputed
  findInvalidControls() {
    const invalid = [];
    const controls = this.loginForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
  }
  // TODO - make a sign in page or just add a new user if old one haven't been found
  login() {
    const {email, password} = this.loginForm.value;
    const invalidControls = this.findInvalidControls();
    if (invalidControls.length) {
      alert('Invalid email or password');
    }
    this.userService.login(email, password);
    console.log('No time for losers');
    console.dir(this.userService.user);
    this.router.navigate(['/games'], {relativeTo: this.route});
    
  }

}
