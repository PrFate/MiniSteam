import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from 'src/app/models/game.model';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-game-item',
  templateUrl: './game-item.component.html',
  styleUrls: ['./game-item.component.scss']
})
export class GameItemComponent implements OnInit {

  @Input() game: Game;

  isUsersLibrary: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UserService) { }

  ngOnInit(): void {
    this.isUsersLibrary = this.route.snapshot.url[0].path === 'library';
  }

  addToUsersLibrary() {
    this.userService.addGame(this.game);
  }

  loadTheVirus() {
    // TODO - implement a joke with downloading a malicious file
    console.group('loadTheVirus()');
    console.groupEnd();
  }

  copyLinkToBuffer() {
    // TODO - fix the copied text when i finish the game details page
    console.group('copyLinkToBuffer()');
    navigator.clipboard.writeText(this.route.toString());
    console.groupEnd();
  }

  navigateToGameDetails() {
    console.dir(this.game);
    this.router.navigate(['/games', this.game.id]);
  }
}
