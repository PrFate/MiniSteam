import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
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
  // prev and next pages buttons state flags
  isNextBtnDisabled: boolean;
  isPrevBtnDisabled: boolean;
  // btns subs
  nextBtnSub: Subscription;
  prevBtnSub: Subscription;

  constructor(private gameService: GameService,
              private userService: UserService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.url.subscribe((url) => {
      // identifying what type of library this should be based on route
      this.isNotUsersLibrary = url[0].path !== 'library';
      if (this.isNotUsersLibrary) {
        this.games$ = this.gameService.getFeaturedGames();
      } else {
        this.games$ = this.userService.getUsersGames();
        this.games$.subscribe(games => {
          console.log('ngOnInit()');
          console.table(games);
        });
      }
      // checking if we should display btns
      this.nextBtnSub = this.gameService.getNextBtnState().subscribe(val => {
        this.isNextBtnDisabled = val;
      });
      this.prevBtnSub = this.gameService.getPrevBtnState().subscribe(val => {
        this.isPrevBtnDisabled = val;
      });
    });
  }

  ngOnDestroy() {
    this.nextBtnSub.unsubscribe();
    this.prevBtnSub.unsubscribe();
  }
  // handling game filters changes
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
    this.games$ = this.gameService.searchForGames(this.gameName, this.gamesTags, this.gamePrice);
  }

  onPriceSelected(price: number) {
    this.gamePrice = price;
    //this.games$ = this.gameService.searchForGames(this.gameName, this.gamesTags, this.gamePrice);
    this.gameService.searchForGames(this.gameName, this.gamesTags, this.gamePrice);
  }
  // handling pagination
  getNextGames() {
    this.gameService.nextPage(this.gameName, this.gamesTags, this.gamePrice);
  }

  getPreviousGames() {
    this.gameService.prevPage(this.gameName, this.gamesTags, this.gamePrice);
  }
}
