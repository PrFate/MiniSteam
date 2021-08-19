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

  public loginForm: FormGroup;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService) { }

  ngOnInit(): void {
    this.loginForm = this.generateLoginFormGroup();
  }

  public generateLoginFormGroup() {
    return new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(20)])
    });
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.loginForm.controls;
    for (const name in controls) {
        if (controls[name].invalid) {
            invalid.push(name);
        }
    }
    return invalid;
}

  public login() {
    const {email, password} = this.loginForm.value;
    const invalidControls = this.findInvalidControls();
    if (invalidControls.length) {
      alert('Invalid email or password');
    }
    this.userService.login(email, password);
    if (this.userService.user) {
      this.router.navigate(['/games'], {relativeTo: this.route});
      return;
    }
    alert(`Couldn't find this user, please, try again`);
  }

}
