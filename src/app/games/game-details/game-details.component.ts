import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameService } from 'src/app/game.service';
import { Game } from 'src/app/models/game.model';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss']
})
export class GameDetailsComponent implements OnInit, OnDestroy {

  // game instance
  game: Game | undefined;
  // game subscription
  gameSub: Subscription;

  constructor(private route: ActivatedRoute,
              private gameService: GameService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.gameSub = this.gameService.getGameById(params.id).subscribe((gam) => {
        this.game = gam;
      });
    });
  }

  ngOnDestroy(): void {
    this.gameSub.unsubscribe();
  }

}
