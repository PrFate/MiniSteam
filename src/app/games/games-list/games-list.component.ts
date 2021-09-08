import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { GameService } from '../../game.service';
import {Game} from '../../models/game.model';

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss'],
  providers: [GameService]
})
export class GamesListComponent implements OnInit {

  listTitle: string;
  @Input() games$: Observable<Game[]>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.listTitle = this.route.snapshot.url[0].path === 'library' ? 'My Games' : 'Featured Games';
  }
}
