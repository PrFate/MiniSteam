import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService) { }

  ngOnInit(): void {
  }

  navigateTo(route: string) {
    if (route === 'profile') {
      this.router.navigate(['/', route]);
    }
    this.router.navigate(['/', route, this.userService.user.id]);
  }
}
