import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import {Game} from '../models/game.model';

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss'],
  providers: [GameService]
})
export class GamesListComponent implements OnInit {

  public listTitle: string;
  public games: Game[];

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.listTitle = 'Featured games';
    this.gameService.getFeaturedGames().subscribe((games: Game[]) => {
      this.games = games
    });
  }

}
