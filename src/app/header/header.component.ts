import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isUserLoggedIn$: Observable<boolean>;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService) { }

  ngOnInit(): void {
    this.isUserLoggedIn$ = this.userService.getUserStatus();
  }

  navigateTo(route: string) {
    if (route === 'profile') {
      this.router.navigate(['/', route], {relativeTo: this.route});
    } else if (route === 'games') {
      this.router.navigate(['/games']);
    } else {
      this.router.navigate(['/', route, this.userService.user.id], {relativeTo: this.route});
    }
  }

  logout() {
    // TODO - implement logoutUser() method of the UserService
    this.userService.logoutUser();
  }
}
