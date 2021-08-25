import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { GameService } from '../game.service';
import { Game } from '../models/game.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {
  // games to display
  games$: Observable<Game[]>;
  // game search parameters
  gameName: string = '';
  gamesTags: string[] = [];
  gamePrice: number = 0;
  // url path flag
  isNotUsersLibrary: boolean;

  constructor(private gameService: GameService,
              private userService: UserService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.isNotUsersLibrary = this.route.snapshot.url[0].path !== 'library';
    if (this.isNotUsersLibrary) {
      this.games$ = this.gameService.getFeaturedGames();
    } else {
      this.games$ = this.userService.getUsersGames();
    }
  }

  onNameInputted(name: string) {
    this.gameName = name;
    this.games$ = this.gameService.searchForGames(this.gameName, this.gamesTags, this.gamePrice);
  }

  onTagSelected(tagData: {name: string, status: boolean}) {
    if (!this.gamesTags.includes(tagData.name)) {
      this.gamesTags.push(tagData.name);
    } else {
      this.gamesTags.splice(this.gamesTags.indexOf(tagData.name), 1);
    }
    console.table(this.gamesTags);
    this.games$ = this.gameService.searchForGames(this.gameName, this.gamesTags, this.gamePrice);
  }

  onPriceSelected(price: number) {
    this.gamePrice = price;
    this.games$ = this.gameService.searchForGames(this.gameName, this.gamesTags, this.gamePrice);
  }
}
