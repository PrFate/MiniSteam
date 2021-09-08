import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { combineLatest, Subscriber, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, first, last, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-game-search',
  templateUrl: './game-search.component.html',
  styleUrls: ['./game-search.component.scss']
})
export class GameSearchComponent implements OnInit {

  gameName = new FormControl('', [Validators.required]);
  @Output() nameEntered = new EventEmitter<string>();
  gameSearchSub: Subscription;

  constructor() { }

  ngOnInit(): void {
    combineLatest([this.gameName.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    )])
      .subscribe(([val]) => {
        this.nameEntered.emit(val);
      });
  }

}
